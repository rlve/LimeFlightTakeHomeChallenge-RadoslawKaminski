import { faker } from '@faker-js/faker';
import { type Page, type Locator, expect } from '@playwright/test';

type FormFields = 'firstName' | 'lastName' | 'email' | 'company' | 'message';

type Checkboxes =
  | 'platform'
  | 'loadPlanning'
  | 'mealPlanning'
  | 'mobileApp'
  | 'inventoryManagement'
  | 'routeOptimization'
  | 'communication';

export class BaseFormPage {
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

  async isFormOpen() {
    await expect(this.firstNameInput).toBeInViewport();
  }

  async isFormClosed() {
    await expect(this.firstNameInput).not.toBeInViewport();
  }

  async submit() {
    await this.submitButton.click();
  }

  async isSuccessPopUpVisible(visible = true) {
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

  async hasFormFieldFocus(element: FormFields) {
    await expect(this.formFieldsLocatorsMap[element]).toBeFocused();
  }

  async hasFormFieldValue(element: FormFields, value: string) {
    await expect(this.formFieldsLocatorsMap[element]).toHaveValue(value);
  }

  // Checkboxes

  async checkElement(element: Checkboxes) {
    await this.checkboxesLocatorsMap[element].check();
  }

  async uncheckElement(element: Checkboxes) {
    await this.checkboxesLocatorsMap[element].uncheck();
  }

  async isChecked(element: Checkboxes, checked = true) {
    await expect(this.checkboxesLocatorsMap[element]).toBeChecked({ checked });
  }

  // Modules

  async uncheckModules() {
    const { communication, ...modulesMap } = this.checkboxesLocatorsMap;

    for (const element of Object.values(modulesMap)) {
      await element.uncheck();
    }
  }

  async areModulesChecked(checked = true) {
    const { communication, ...modulesMap } = this.checkboxesLocatorsMap;

    for (const element of Object.values(modulesMap)) {
      await expect(element).toBeChecked({ checked });
    }
  }
}
