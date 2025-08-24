import app from "../server/app.js";
import request from "supertest";
import { describe, expect, test, afterAll } from "vitest";
import pool from "../db/mk/index.js";

afterAll( async () => {
  await pool.query("UPDATE users SET username = 'spokeofk' WHERE email = 'kurakn10@gmail.com'")
})

describe("/api/update/272", () => {
  test("имя меняется", async () => {
    const result = await request(app)
      .put("/api/update/272")
      .set(
        "x-api-key",
        "Qvo20y+SzG+l5AxO2Pzxt8Nt30FzzssBpWx7JLqJRWbPjGUYHQg1YhMWOcTj9HZK9ZE6cCyjibNlRit7vF3o6Q=="
      )
      .send({
        newValue: "successfullChange",
        changeMethod: "username",
      });
    expect(result.body.userInformation.username).toBe("successfullChange");
  });
});
