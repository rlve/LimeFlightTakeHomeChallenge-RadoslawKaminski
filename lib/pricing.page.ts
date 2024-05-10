import { type Page, type Locator, expect } from '@playwright/test';
import { BaseFormPage } from './base-form.page';

export class PricingPage extends BaseFormPage {
  constructor(public readonly page: Page) {
    super(page);
  }

  // Actions

  async goto() {
    await this.page.goto('https://test.limeflight.com/pricing/');
  }
}
