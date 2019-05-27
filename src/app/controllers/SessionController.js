const { User } = require("../models");
// const Mail = require("../services/MailService");

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

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
  }

  async register(req, res) {}
}

module.exports = new SessionController();
