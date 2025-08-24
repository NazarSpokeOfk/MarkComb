import request from "supertest";
import app from "../server/app";
import pool from "../db/mk/index.js";

import { beforeAll, describe, expect, test } from "vitest";

beforeAll( async () => {
    await pool.query("INSERT INTO purchases_channels (user_id,channel_name,thumbnail,email) VALUES (272,'Stopgame', 'thumbnail', 'mail.com')")
})

describe("/api/rmpurchase/272", () => {
  test("удаление покупки работает", async () => {
    const result = await request(app)
      .delete("/api/rmpurchase/272")
      .set(
        "x-api-key",
        "Qvo20y+SzG+l5AxO2Pzxt8Nt30FzzssBpWx7JLqJRWbPjGUYHQg1YhMWOcTj9HZK9ZE6cCyjibNlRit7vF3o6Q=="
      )
      .send({
        channelName : "Stopgame"
      });
    expect(result.body).toHaveProperty("transaction_id");
  });
});