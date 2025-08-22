import request from "supertest";
import pool from "../db/main";
import app from "../app";

import { describe, expect, test } from "vitest";

describe("/api//login", () => {
  test("вход работает", async () => {
    const result = await request(app)
      .post("/api/login")
      .set(
        "x-api-token",
        "Qvo20y+SzG+l5AxO2Pzxt8Nt30FzzssBpWx7JLqJRWbPjGUYHQg1YhMWOcTj9HZK9ZE6cCyjibNlRit7vF3o6Q=="
      )
      .send({
        email : "kurakn10@gmail.com",
        password : "KUROK!&_!(@)"
      })
  });
  expect(result.body.userInformation).toHaveProperty("csrfToken");
  expect(result.body.userInformation.email).toBe("kurakn10@gmail.com");
});
