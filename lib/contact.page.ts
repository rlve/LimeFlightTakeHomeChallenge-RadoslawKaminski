import { type Page, type Locator, expect } from '@playwright/test';
import { BaseFormPage } from './base-form.page';

type ContactFormButtons = 'contactSales' | 'getStarted';

export class ContactPage extends BaseFormPage {
  private readonly contactSalesButton: Locator;
  private readonly getStartedEmailInput: Locator;
  private readonly getStartedButton: Locator;
  private readonly closeContactFormButton: Locator;

  private contactFormButtonsLocatorsMap: {
    [key in ContactFormButtons]: Locator;
  };

  constructor(public readonly page: Page) {
    super(page);

    this.contactSalesButton = page.getByRole('button', {
      name: 'Contact Sales',
    });
    this.getStartedEmailInput = page.getByPlaceholder(
      'Enter your email address',
    );
    this.getStartedButton = page
      .locator('section')
      .filter({
        hasText:
          'The Future of Inflight LogisticsThe only end to end inflight logistics software',
      })
      .getByRole('button');
    this.closeContactFormButton = page.getByRole('img', { name: 'Close' });

    this.contactFormButtonsLocatorsMap = {
      contactSales: this.contactSalesButton,
      getStarted: this.getStartedButton,
    };
  }

  // Actions

  async goto() {
    await this.page.goto('https://test.limeflight.com/');
  }

  async openContactForm(element: ContactFormButtons = 'contactSales') {
    await this.contactFormButtonsLocatorsMap[element].click();
  }

  async closeContactForm() {
    await this.closeContactFormButton.click();
  }

  async enterEmailToGetStarted(email: string) {
    await this.getStartedEmailInput.fill(email);
  }
}
