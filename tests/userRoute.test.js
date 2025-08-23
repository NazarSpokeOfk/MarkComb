import { test, expect } from "@playwright/test";

test("проверка маршрута пользователя", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.fill("#email", "kurakn10@gmail.com");
  await page.fill("#password", "KUROK!&_!(@)");
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page.getByText(/Welcome, spokeofk/i)).toBeVisible();
  await expect(page).toHaveURL(/search/);

  await page.goto("http://localhost:3000/search");

  const input = page.locator(".search__main");
  const searchButton = page.locator(".search__glass");
  const youtuberBlock = page.locator(".youtuber__block");
  const purchaseButton = page.locator(".youtuber__block-button");
  const promotionBlock = page.locator(".card").first();
  const promotionSearchBlock = page.locator(".promotion-search")
  const promotionSearchInput = page.locator(".promotion__input");
  const promotionSearchButton = page.locator(".promotion__search-btn");
  const resultWrapper = page.locator(".result__wrapper");

  await input.fill("Stopgame");
  await searchButton.click();

  await expect(youtuberBlock).toBeVisible();
  await purchaseButton.click();
  await expect(purchaseButton).toHaveText("✅");

  await page.goto("http://localhost:3000/promotion")
  await promotionBlock.waitFor({state: "visible"})
  await promotionBlock.click();
  await promotionSearchBlock.waitFor({state : "visible"})
  await promotionSearchInput.fill("Обзор Marvel Rivals")
  await promotionSearchButton.click();
  
  await resultWrapper.waitFor({state : "visible"})

  await page.goto("http://localhost:3000/purchases");
  await page.locator(".remove__btn").first().waitFor({ state: "visible" });
  await page.locator(".remove__btn").first().click();

  await page.waitForTimeout(500);
  await expect(page.locator(".purchase__block").first()).toBeHidden();
});
