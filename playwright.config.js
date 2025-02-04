import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true, // Запуск без UI браузера
    viewport: { width: 1280, height: 720 }, // Размер окна
    trace: 'on', // Включаем трассировку
  },
  testDir : "./tests",
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});