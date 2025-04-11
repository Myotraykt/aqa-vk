import { test, expect } from '@playwright/test';
import {WidgetPage} from "./widget.page";

test.describe('Uchi.ru widget ', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({page}) => {
    widgetPage = new WidgetPage(page);

    // open uchi.ru main page
    await page.goto('/');

    // close cookies popup
    await page.click('._UCHI_COOKIE__button');
  });

  test('opens', async ({ page }) => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible()
  });

  test('has correct title', async ({ page }) => {
    await widgetPage.openWidget();

    const articlesList = widgetPage.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST);
    await expect(articlesList).toBeVisible();

    const articles = await widgetPage.getPopularArticles();
    expect(articles.length).toBeGreaterThan(0);

    await articles[0].waitFor();
    await articles[0].click();

    await widgetPage.clickWriteToUs();

    await expect(await widgetPage.getTitle()).toEqual('Связь с поддержкой');
  });

  // новый тест, проверяет корректность заголовков популярных статей
  test('has proper popular articles heading', async ({ page }) => {
    await widgetPage.openWidget();
  
    const popularTitle = widgetPage.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_TITLE);
    await expect(popularTitle).toBeVisible();
    await expect(popularTitle).toHaveText('Популярные статьи');
  });
});
