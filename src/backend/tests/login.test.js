import request from "supertest";
import app from "../server/app.js";

import { describe, expect, test } from "vitest";

describe("/api/login", () => {
  test("вход работает", async () => {
    const result = await request(app)
      .post("/api/login")
      .set(
        "x-api-key",
        "Qvo20y+SzG+l5AxO2Pzxt8Nt30FzzssBpWx7JLqJRWbPjGUYHQg1YhMWOcTj9HZK9ZE6cCyjibNlRit7vF3o6Q=="
      )
      .send({
        email: "kurakn10@gmail.com",
        password: "KUROK!&_!(@)",
      });
    expect(result.body).toHaveProperty("data");
  });
});
