const { Company } = require('../models');
const schema = require('../validators/company');
const jwt = require('jsonwebtoken');
const nexmo = require('../Services/Nexmo');
const util = require('util');
const { cnpj: Cnpj } = require('cpf-cnpj-validator');
const Mail = require('../Services/MailService');

class CompanyController {
  async store(req, res) {
    let transaction;
    try {
      const { email, cnpj, phone } = req.body;

      // Check field cnpj
      const checkCnpj = Cnpj.isValid(cnpj);
      if (!checkCnpj) {
        return res
          .status(200)
          .json({ error: true, input: 'cnpj', msg: 'Cnpj inválido' });
      }

      if (!(await schema.isValid(req.body))) {
        return res.status(200).json({ error: true });
      }

      const company = await Company.findOne({ where: { email } });
      const companyCnpj = await Company.findOne({ where: { cnpj } });

      if (companyCnpj) {
        return res
          .status(200)
          .json({ error: true, input: 'cnpj', msg: 'CNPJ já cadastrado' });
      }

      if (company) {
        return res
          .status(200)
          .json({ error: true, input: 'email', msg: 'E-mail já cadastrado' });
      }

      // Open transaction
      transaction = await Company.sequelize.transaction();
      const comp = await Company.create({
        email,
        cnpj,
        phone
      });

      // End transaction
      transaction.commit();

      // Create a token
      const token = await jwt.sign({ id: comp.id }, process.env.APP_SECRET);

      // Save token
      await Company.update({ token }, { where: { id: comp.id } });

      const verifyRequestPromise = util.promisify(
        nexmo.verify.request.bind(nexmo.verify)
      );

      const result = await verifyRequestPromise({
        number: `55${phone}`,
        brand: process.env.NEXMO_BRAND,
        code_length: process.env.NEXMO_CODE_LENGTH
      });

      return res.json({
        result,
        token,
        id: comp.id
      });
    } catch (error) {
      // if (transaction) transaction.rollback();
      return res.json({ error });
    }
  }

  async verify(req, res) {
    const { requestId, code, id } = req.body;

    !requestId &&
      res.status(401).json({ msg: 'Campo requestId é obrigatório' });
    !code && res.status(401).json({ msg: 'Campo code é obrigatório' });
    !id && res.status(401).json({ msg: 'Campo id é obrigatório' });

    try {
      const verifyCodePromise = util.promisify(
        nexmo.verify.check.bind(nexmo.verify)
      );

      const response = await verifyCodePromise({
        request_id: requestId,
        code
      });

      if (response.status && response.status === 0) {
        const company = await Company.findOne({ where: { id } });
        const url = `${process.env.APP_URL}:3001/verify-email/${company.token}/${id}`;
        await Mail.send({
          from: process.env.MAIL_FROM,
          to: `<${company.email}>`,
          subject: 'Confirmação de cadastro - Eagle Bank',
          html: `<p>Click no link abaixo para confirmar seu cadastro no Eagle Bank</p><br />
            <a href="${url}">${url}</a>
          `
        });
      }

      res.json({ response });
    } catch (error) {
      console.log(error);
      return res.json({ error });
    }

    // nexmo.verify.check(
    //   {
    //     request_id: requestId,
    //     code
    //   },
    //   (err, result) => {
    //     const response = err ? err : result;
    //     return res.json({ response });
    //   }
    // );
  }

  async resubmit(req, res) {
    const { requestId, phone } = req.body;

    !requestId && res.send({ error: 'Campo requestId é obrigatório' });
    !phone && res.send({ error: 'Campo phone é obrigatório' });

    try {
      // Cancel a request
      const controlCancel = util.promisify(
        nexmo.verify.control.bind(nexmo.verify)
      );

      await controlCancel({
        request_id: requestId,
        cmd: 'cancel'
      });

      // Create a request
      const verifyRequestPromise = util.promisify(
        nexmo.verify.request.bind(nexmo.verify)
      );

      const result = await verifyRequestPromise({
        number: `55${phone}`,
        brand: process.env.NEXMO_BRAND,
        code_length: process.env.NEXMO_CODE_LENGTH
      });

      return res.json({ result });
    } catch (error) {
      console.log(error);
      return res.json({ error });
    }
  }

  async verifyEmail(req, res) {
    const { id, token } = req.body;

    if (!id) {
      res.send({ error: 'Campo id é obrigatório' });
    }

    if (!token) {
      res.send({ error: 'Campo token é obrigatório' });
    }

    try {
      const company = await Company.findOne({
        where: { id, token }
      });

      if (!company) {
        return res.json({ status: false, msg: 'Link inválido' });
      }

      await Company.update({ verified: true }, { where: { id: company.id } });

      return res.json({ status: true });
    } catch (error) {
      return res.json({ error });
    }
  }
}

module.exports = new CompanyController();

// const nexmo = require("../services/nexmo");
// const { UsersCellphone } = require("../models");
// const { generateDigits } = require('../helpers');
// const responseCode = require("../helpers/codeList");
// const sequelizeHelper = require('../helpers/updateOrCreate');

// module.exports = {
//   async checkCellphone(req, res, next) {
//     try {
//       const { cellphone } = req.body;
//       const user_id = req.userId;

//       const digits = await generateDigits();

//       await sequelizeHelper.updateOrCreate(UsersCellphone, { user_id : user_id }, { user_id, cellphone, digits, checked : 0 });

//       const result = await nexmo.sendSms('OnSocial', cellphone, `[OnSocial] Seus digitos: ${digits}`);

//       if(result) return res.json({ status : responseCode[0] });

//       throw new Error('problem with sms verification');

//     } catch (error) {
//       next(error);
//     }
//   },

//   async checkDigits(req, res, next) {
//     try {
//       const { digits, cellphone } = req.body;

//       const user_id = req.userId;

//       let data = await UsersCellphone.update({ checked: 1},{ where: {user_id, digits, cellphone, checked: 0} });

//       if(data == 1) {
//         res.status(200).json({ status : responseCode[0] })
//       } else {
//         res.status(400).json({ status : responseCode[10] })
//       }

//     } catch (error) {
//       next(error);
//     }
//   }

// };
