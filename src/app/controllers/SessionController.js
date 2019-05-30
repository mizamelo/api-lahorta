const { User } = require("../models");
// const Mail = require("../services/MailService");

class SessionController {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      !email && res.status(401).json({ msg: "Campo email é obrigatório" });
      !password &&
        res.status(401).json({ msg: "Campo password é obrigatório" });

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "E-mail não encontrado" });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ message: "Senha inválida" });
      }

      // await Mail.send({
      //   from: process.env.MAIL_FROM,
      //   to: `${user.name} <${user.email}>`,
      //   subject: "Um novo acesso ocorreu em sua conta",
      //   text: `Olá, ${user.name}. Verificamos um novo acesso em sua conta.`
      // });

      return res.json({
        token: await user.generateToken()
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({ msg: error });
    }
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      !name && res.status(401).json({ msg: "Campo name é obrigatório" });
      !email && res.status(401).json({ msg: "Campo email é obrigatório" });
      !password &&
        res.status(401).json({ msg: "Campo password é obrigatório" });

      const user = await User.create({
        name,
        email,
        password
      });

      return res.json({
        token: await user.generateToken()
      });
    } catch (error) {
      res.status(401).json({ msg: error });
    }
  }
}

module.exports = new SessionController();
