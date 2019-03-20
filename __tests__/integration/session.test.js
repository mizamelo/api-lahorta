const request = require("supertest");
const nodemailer = require("nodemailer");

const app = require("../../src/app");
const truncate = require("../utils/truncate");
const factory = require("../factories");

jest.mock("nodemailer");

const transport = {
  sendMail: jest.fn()
};

describe("Authentication", () => {
  beforeEach(async () => {
    await truncate();
  });

  beforeAll(() => {
    nodemailer.createTransport.mockReturnValue(transport);
  });

  it("Usuario deve poder se autenticar com credenciais validas", async () => {
    const user = await factory.create("User", {
      password: "123123"
    });

    const reponse = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123123"
      });

    expect(reponse.status).toBe(200);
  });

  it("Usuário não pode se autenticar com email invalido", async () => {
    const user = await factory.create("User", {
      email: "admin@admin.com"
    });

    const reponse = await request(app)
      .post("/sessions")
      .send({
        email: "outro@email.com",
        password: user.password
      });

    expect(reponse.status).toBe(401);
  });

  it("Usuário não pode se autenticar com senha invalida", async () => {
    const user = await factory.create("User", {
      password: "123465"
    });

    const reponse = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123456"
      });

    expect(reponse.status).toBe(401);
  });

  it("Após o login, o token de acesso deve ser retornado", async () => {
    const user = await factory.create("User", {
      password: "123123"
    });

    const reponse = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123123"
      });

    expect(reponse.body).toHaveProperty("token");
  });

  it("O usuário pode acessar rotas privadas", async () => {
    const user = await factory.create("User");

    const reponse = await request(app)
      .get("/payment")
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(reponse.status).toBe(200);
  });

  it("O usuário não pode acessar rotas privadas quando não está autenticado", async () => {
    const reponse = await request(app).get("/payment");

    expect(reponse.status).toBe(401);
  });

  it("Verifica se o token é válido", async () => {
    const reponse = await request(app)
      .get("/payment")
      .set("Authorization", "Bearer 123123");

    expect(reponse.status).toBe(401);
  });

  it("Deve receber um e-mail quando se autenticar", async () => {
    const user = await factory.create("User", {
      password: "123123"
    });

    const reponse = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123123"
      });

    expect(transport.sendMail).toHaveBeenCalledTimes(1);
    expect(transport.sendMail.mock.calls[0][0].to).toBe(
      `${user.name} <${user.email}>`
    );
  });
});
