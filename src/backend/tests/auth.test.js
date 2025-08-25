import request from "supertest";
import mainPool from "../db/mk/index.js";
import app from "../server/app.js";

import { test } from "vitest";

beforeAll(async () => {
  await mainPool.query("DELETE FROM users WHERE email = 'testemail@domain.com'");
});

afterAll(async () => {
  await mainPool.query("DELETE FROM users WHERE email = 'testemail@domain.com'");
  await mainPool.end();
});

describe("POST api/user", () => {
  test("новый пользователь зарегестрирован", async () => {
    const result = await request(app)
      .post("/api/user")
      .set(
        "x-api-key",
        "Qvo20y+SzG+l5AxO2Pzxt8Nt30FzzssBpWx7JLqJRWbPjGUYHQg1YhMWOcTj9HZK9ZE6cCyjibNlRit7vF3o6Q=="
      )
      .send({
        data: {
          email: "testemail@domain.com",
          password: "123456",
          username: "testuser",
        },
      });

    expect(result.statusCode).toBe(200);
    expect(result.body.userInformation).toHaveProperty("csrfToken");
    expect(result.body.userInformation.email).toBe("testemail@domain.com");
  });

  test("не удается зарегестрировать дубликат", async () => {
    const result = await request(app)
      .post("/api/user")
      .set(
        "x-api-key",
        "Qvo20y+SzG+l5AxO2Pzxt8Nt30FzzssBpWx7JLqJRWbPjGUYHQg1YhMWOcTj9HZK9ZE6cCyjibNlRit7vF3o6Q=="
      )
      .send({
        data: {
          email: "testemail@domain.com",
          password: "123456",
          username: "testuser",
        },
      });

    expect(result.statusCode).toBe(500);
    expect(result.body.error).toBe("Internal server error");
  });
});
