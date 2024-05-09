import { type Page, type Locator, expect } from '@playwright/test';

export class ContactPage {
  private readonly contactSalesButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly companyInput: Locator;
  private readonly messageInput: Locator;
  private readonly platformModule: Locator;
  private readonly loadPlanningModule: Locator;
  private readonly mealPlanningModule: Locator;
  private readonly mobileAppModule: Locator;
  private readonly inventoryManagementModule: Locator;
  private readonly routeOptimizationModule: Locator;
  private readonly communicationCheckbox: Locator;
  private readonly getStartedButton: Locator;
  private readonly successPopUp: Locator;

  constructor(public readonly page: Page) {
    this.contactSalesButton = page.getByRole('button', {
      name: 'Contact Sales',
    });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.emailInput = page.getByPlaceholder('Email Address', { exact: true });
    this.companyInput = page.getByPlaceholder('Company');
    this.messageInput = page.getByPlaceholder('Message');
    this.platformModule = page
      .locator('label')
      .filter({ hasText: 'Platform' })
      .locator('div');
    this.loadPlanningModule = page
      .locator('label')
      .filter({ hasText: 'LoadPlanning' })
      .locator('div');
    this.mealPlanningModule = page
      .locator('label')
      .filter({ hasText: 'MealPlanning' })
      .locator('div');
    this.mobileAppModule = page
      .locator('label')
      .filter({ hasText: 'MobileApp' })
      .locator('div');
    this.inventoryManagementModule = page
      .locator('label')
      .filter({ hasText: 'InventoryManagement' })
      .locator('div');
    this.routeOptimizationModule = page
      .locator('label')
      .filter({ hasText: 'RouteOptimization' })
      .locator('div');
    this.communicationCheckbox = page.getByLabel('I agree to receive other');
    this.getStartedButton = page
      .locator('form')
      .filter({ hasText: 'Get Started with LimeFlight!' })
      .getByRole('button');
    this.successPopUp = page.getByText("Thanks!We'll be right with");
  }

  async goto() {
    await this.page.goto('https://test.limeflight.com/');
  }

  async openContactForm() {
    await this.contactSalesButton.click();
  }

  async fillForm(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    company?: string;
    message?: string;
  }) {
    if (data.firstName) await this.firstNameInput.fill(data.firstName);
    if (data.lastName) await this.lastNameInput.fill(data.lastName);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.company) await this.companyInput.fill(data.company);
    if (data.message) await this.messageInput.fill(data.message);
  }

  async submit() {
    await this.getStartedButton.click();
  }

  async hasBeenSubmittedSuccesfully() {
    await expect(this.successPopUp).toBeVisible();
  }
}
