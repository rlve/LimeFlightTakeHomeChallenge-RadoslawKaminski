import { faker } from '@faker-js/faker';
import { type Page, type Locator, expect, Request } from '@playwright/test';
import { BaseFormPage } from './base-form.page';

type PriceFactors = 'aircraftsNumber' | 'oneWayPerYear' | 'guestsNumberPerYear';

export class PricingPage extends BaseFormPage {
  private readonly aircraftsNumberInput: Locator;
  private readonly oneWayPerYearInput: Locator;
  private readonly guestsNumberPerYearInput: Locator;

  private priceFactorsLocatorsMap: { [key in PriceFactors]: Locator };

  constructor(public readonly page: Page) {
    super(page);

    // Page specific locators
    this.aircraftsNumberInput = page.getByPlaceholder('Number of aircrafts');
    this.oneWayPerYearInput = page.getByPlaceholder('One-way flights / year');
    this.guestsNumberPerYearInput = page.getByPlaceholder(
      'Number of guests / year',
    );

    this.priceFactorsLocatorsMap = {
      aircraftsNumber: this.aircraftsNumberInput,
      oneWayPerYear: this.oneWayPerYearInput,
      guestsNumberPerYear: this.guestsNumberPerYearInput,
    };

    // Locators from BaseForm
    this.firstNameInput = page
      .locator('section')
      .filter({ hasText: 'Pricing built for airlines of' })
      .getByPlaceholder('First Name');
    this.lastNameInput = page
      .locator('section')
      .filter({ hasText: 'Pricing built for airlines of' })
      .getByPlaceholder('Last Name');
    this.emailInput = page
      .locator('section')
      .filter({ hasText: 'Pricing built for airlines of' })
      .getByPlaceholder('Email Address');
    this.companyInput = page
      .locator('section')
      .filter({ hasText: 'Pricing built for airlines of' })
      .getByPlaceholder('Company');
    this.messageInput = page
      .locator('section')
      .filter({ hasText: 'Pricing built for airlines of' })
      .getByPlaceholder('Message');
    this.platformModule = page.getByText('Platform').nth(3);
    this.loadPlanningModule = page.getByText('LoadPlanning').nth(2);
    this.mealPlanningModule = page.getByText('MealPlanning').nth(2);
    this.mobileAppModule = page.getByText('MobileApp').nth(2);
    this.inventoryManagementModule = page
      .getByText('InventoryManagement')
      .nth(2);
    this.routeOptimizationModule = page.getByText('RouteOptimization').nth(2);
    this.communicationCheckbox = page
      .locator('section')
      .filter({ hasText: 'Pricing built for airlines of' })
      .getByLabel('I agree to receive other');
    this.submitButton = page.getByRole('button', { name: 'Get Price' });

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

  async goto() {
    await this.page.goto('https://test.limeflight.com/pricing/');
  }

  // Price factors

  async fillPriceFactorsDefaultValues() {
    await this.fillPriceFactors({
      aircraftsNumber: faker.number.int(200),
      oneWayPerYear: faker.number.int(10000),
      guestsNumberPerYear: faker.number.int(1000000),
    });
  }

  async fillPriceFactors(data: {
    [key in PriceFactors]?: number;
  }) {
    if (data.aircraftsNumber !== undefined) {
      await this.aircraftsNumberInput.fill(data.aircraftsNumber.toString());
    }
    if (data.oneWayPerYear !== undefined) {
      await this.oneWayPerYearInput.fill(data.oneWayPerYear.toString());
    }
    if (data.guestsNumberPerYear !== undefined) {
      await this.guestsNumberPerYearInput.fill(
        data.guestsNumberPerYear.toString(),
      );
    }
  }

  async assertPriceFactorFocus(element: PriceFactors) {
    await expect(this.priceFactorsLocatorsMap[element]).toBeFocused();
  }

  async assertPriceFactorValue(element: PriceFactors, value: string) {
    await expect(this.priceFactorsLocatorsMap[element]).toHaveValue(value);
  }

  // API

  async assertPriceFactorsInRequest(
    request: Request,
    name: PriceFactors,
    value: number,
  ) {
    const map: { [key in PriceFactors]: string } = {
      aircraftsNumber: '0-2/number_of_aircrafts',
      oneWayPerYear: '0-2/number_of_one_way_flights_per_year',
      guestsNumberPerYear: '0-2/number_of_guests_per_year',
    };

    this.assertFieldsInRequest(request, map[name], value.toString());
  }
}
