import { faker } from '@faker-js/faker';
import { type Page, type Locator, expect, Request } from '@playwright/test';

type FormFields = 'firstName' | 'lastName' | 'email' | 'company' | 'message';

type Modules =
  | 'platform'
  | 'loadPlanning'
  | 'mealPlanning'
  | 'mobileApp'
  | 'inventoryManagement'
  | 'routeOptimization';

type Checkboxes = Modules | 'communication';

export class BaseFormPage {
  private readonly allowAllCookies: Locator;
  protected firstNameInput: Locator;
  protected lastNameInput: Locator;
  protected emailInput: Locator;
  protected companyInput: Locator;
  protected messageInput: Locator;
  protected platformModule: Locator;
  protected loadPlanningModule: Locator;
  protected mealPlanningModule: Locator;
  protected mobileAppModule: Locator;
  protected inventoryManagementModule: Locator;
  protected routeOptimizationModule: Locator;
  protected communicationCheckbox: Locator;
  protected submitButton: Locator;
  private readonly successPopUp: Locator;
  private readonly successPopUpCloseButton: Locator;

  protected formFieldsLocatorsMap: { [key in FormFields]: Locator };
  protected checkboxesLocatorsMap: { [key in Checkboxes]: Locator };

  constructor(public readonly page: Page) {
    this.allowAllCookies = page.getByRole('button', {
      name: 'Allow all cookies',
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
    this.submitButton = page
      .locator('form')
      .filter({ hasText: 'Get Started with LimeFlight!' })
      .getByRole('button');
    this.successPopUp = page.getByText("Thanks!We'll be right with");
    this.successPopUpCloseButton = page
      .getByRole('img', { name: 'Close' })
      .nth(1);

    this.formFieldsLocatorsMap = {
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
      email: this.emailInput,
      company: this.companyInput,
      message: this.messageInput,
    };

    this.checkboxesLocatorsMap = {
      platform: this.platformModule,
      loadPlanning: this.loadPlanningModule,
      mealPlanning: this.mealPlanningModule,
      mobileApp: this.mobileAppModule,
      inventoryManagement: this.inventoryManagementModule,
      routeOptimization: this.routeOptimizationModule,
      communication: this.communicationCheckbox,
    };
  }

  // Actions

  async tryCloseCookiesPopUp() {
    if (!process.env.CI) {
      try {
        await this.allowAllCookies.click({ timeout: 2000 });
      } catch (error) {}
    }
  }

  async assertFormOpen() {
    await expect(this.firstNameInput).toBeInViewport();
  }

  async assertFormClosed() {
    await expect(this.firstNameInput).not.toBeInViewport();
  }

  async submit() {
    await this.submitButton.click();
  }

  async assertSuccessPopUpVisible(visible = true) {
    await expect(this.successPopUp).toBeVisible({ visible });
  }

  async closeSuccessPopUp() {
    await this.successPopUpCloseButton.click();
  }

  // Form fields

  async fillFormDefaultValues() {
    await this.fillForm({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      company: faker.company.name(),
      message: faker.lorem.paragraph(),
    });
  }

  async fillForm(data: { [key in FormFields]?: string }) {
    if (data.firstName !== undefined)
      await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined)
      await this.lastNameInput.fill(data.lastName);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.company !== undefined) await this.companyInput.fill(data.company);
    if (data.message !== undefined) await this.messageInput.fill(data.message);
  }

  async assertFormFieldFocus(element: FormFields) {
    await expect(this.formFieldsLocatorsMap[element]).toBeFocused();
  }

  async assertFormFieldValue(element: FormFields, value: string) {
    await expect(this.formFieldsLocatorsMap[element]).toHaveValue(value);
  }

  // Checkboxes

  async checkElement(element: Checkboxes) {
    await this.checkboxesLocatorsMap[element].check();
  }

  async uncheckElement(element: Checkboxes) {
    await this.checkboxesLocatorsMap[element].uncheck();
  }

  async assertChecked(element: Checkboxes, checked = true) {
    await expect(this.checkboxesLocatorsMap[element]).toBeChecked({ checked });
  }

  // Modules

  async uncheckModules() {
    const { communication, ...modulesMap } = this.checkboxesLocatorsMap;

    for (const element of Object.values(modulesMap)) {
      await element.uncheck();
    }
  }

  async assertModulesChecked(checked = true) {
    const { communication, ...modulesMap } = this.checkboxesLocatorsMap;

    for (const element of Object.values(modulesMap)) {
      await expect(element).toBeChecked({ checked });
    }
  }

  // API

  async getRequestPromise() {
    return this.page.waitForRequest((request) => request.method() === 'POST');
  }

  async assertFieldsInRequest(request: Request, name: string, value: string) {
    expect(request.postDataJSON()?.fields).toContainEqual({ name, value });
  }

  async assertModulesInRequest(request: Request, module: Modules) {
    const map: { [key in Modules]: string } = {
      platform: 'Platform',
      loadPlanning: 'LoadPlanning',
      mealPlanning: 'MealPlanning',
      mobileApp: 'MobileApp',
      inventoryManagement: 'InventoryManagement',
      routeOptimization: 'RouteOptimization',
    };

    this.assertFieldsInRequest(request, 'modules_of_interest', map[module]);
  }
}
