import { test as base } from '@playwright/test';
import { ContactPage } from './contact.page';

export const test = base.extend<{ contactPage: ContactPage }>({
  contactPage: async ({ page }, use) => {
    const todoPage = new ContactPage(page);
    await todoPage.goto();
    await use(todoPage);
  },
});
