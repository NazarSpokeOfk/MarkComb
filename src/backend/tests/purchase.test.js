import app from "../server/app.js";
import request from "supertest";
import mainPool from "../db/mk/index.js";
import { afterAll, describe, expect, test } from "vitest";

afterAll( async () => {
    await mainPool.query("DELETE FROM purchases_channels WHERE user_id = 272 AND email ='testpurchase@domain.com'")
})

describe("/api/purchase/272", () => {
    test("совершение покупки", async () => {
      const result = await request(app)
        .post("/api/purchase/272")
        .set(
          "x-api-key",
          "Qvo20y+SzG+l5AxO2Pzxt8Nt30FzzssBpWx7JLqJRWbPjGUYHQg1YhMWOcTj9HZK9ZE6cCyjibNlRit7vF3o6Q=="
        )
        .send({
          email: "testpurchase@domain.com",
          thumbnail: "https://pechen",
          channelName : "testchannel",
        });
      console.log("purchaseTest : ", result.body)
      expect(result.body).toHaveProperty("remainingUses");
    });
  });
  