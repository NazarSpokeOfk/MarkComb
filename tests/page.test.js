import { test, expect } from '@playwright/test';

test('Проверка скорости загрузки', async ({ page }) => {
  const start = performance.now();
  await page.goto('http://localhost:3000');
  const end = performance.now();

  console.log(`Страница загрузилась за ${end - start} мс`);
});
