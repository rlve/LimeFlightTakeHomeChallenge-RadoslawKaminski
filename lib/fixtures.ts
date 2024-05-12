import { test as base } from '@playwright/test';
import { ContactPage } from './contact.page';
import { PricingPage } from './pricing.page';

export const test = base.extend<{
  contactPage: ContactPage;
  pricingPage: PricingPage;
}>({
  contactPage: async ({ page }, use) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto();
    await contactPage.tryCloseCookiesPopUp();
    await use(contactPage);
  },
  pricingPage: async ({ page }, use) => {
    const pricingPage = new PricingPage(page);
    await pricingPage.goto();
    await pricingPage.tryCloseCookiesPopUp();
    await use(pricingPage);
  },
});
