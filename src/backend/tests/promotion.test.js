import request from "supertest";
import app from "../server/app.js";

import { describe, expect, test } from "vitest";

describe("/api/video", () => {
  test("проверка статистики видео работает", async () => {
    const result = await request(app)
      .post("/api/video")
      .set(
        "x-api-key",
        "Qvo20y+SzG+l5AxO2Pzxt8Nt30FzzssBpWx7JLqJRWbPjGUYHQg1YhMWOcTj9HZK9ZE6cCyjibNlRit7vF3o6Q=="
      )
      .send({
        type: "video",
        channelName: "Stopgame",
        inputValue: "Обзор Marvel Rivals",
        videoId: null,
      });
    expect(result.body).toHaveProperty("data");
  });
});
