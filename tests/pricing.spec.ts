import { test } from '../lib/fixtures';
import { faker } from '@faker-js/faker';

test.describe.configure({ mode: 'parallel' });

test.describe('Pricing form', () => {
  test.describe('submission', () => {
    test('can be submitted succesfully with correct data', async ({
      pricingPage,
    }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible();
    });

    test('can be submitted succesfully with modules unchecked', async ({
      pricingPage,
    }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.uncheckModules();
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible();
    });

    test('can be submitted succesfully with communication checkbox unchecked', async ({
      pricingPage,
    }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.uncheckElement('communication');
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible();
    });

    test.fail(
      'clears the form after succesfull submission',
      async ({ pricingPage }) => {
        await pricingPage.fillFormDefaultValues();
        await pricingPage.fillPriceFactorsDefaultValues();
        await pricingPage.submit();

        await pricingPage.isSuccessPopUpVisible();

        await pricingPage.closeSuccessPopUp();

        await pricingPage.hasFormFieldValue('firstName', '');
      },
    );

    test.fail(
      'POST request with fields is send to api.hsforms.com when submitted succesfully',
      async ({ pricingPage }) => {
        const fields = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          company: faker.company.name(),
          message: faker.lorem.paragraph(),
        };
        await pricingPage.fillForm(fields);

        const priceFactors = {
          aircraftsNumber: faker.number.int(200),
          oneWayPerYear: faker.number.int(10000),
          guestsNumberPerYear: faker.number.int(1000000),
        };
        await pricingPage.fillPriceFactors(priceFactors);

        const requestPromise = pricingPage.getRequestPromise();
        await pricingPage.submit();
        const request = await requestPromise;

        pricingPage.areFieldsInRequest(request, 'firstname', fields.firstName);
        pricingPage.areFieldsInRequest(request, 'lastname', fields.lastName);
        pricingPage.areFieldsInRequest(request, 'email', fields.email);
        pricingPage.areFieldsInRequest(request, 'company', fields.company);
        pricingPage.areFieldsInRequest(request, 'message', fields.message); // fail: missing message
        pricingPage.areModulesInRequest(request, 'platform');
        pricingPage.areModulesInRequest(request, 'loadPlanning');
        pricingPage.areModulesInRequest(request, 'mealPlanning');
        pricingPage.areModulesInRequest(request, 'mobileApp');
        pricingPage.areModulesInRequest(request, 'inventoryManagement');
        pricingPage.areModulesInRequest(request, 'routeOptimization');
        pricingPage.arePriceFactorsInRequest(request, 'aircraftsNumber', priceFactors.aircraftsNumber); // prettier-ignore
        // fail: number of one way flight is swapped with number of guests
        pricingPage.arePriceFactorsInRequest(request, 'oneWayPerYear', priceFactors.oneWayPerYear); // prettier-ignore
        pricingPage.arePriceFactorsInRequest(request, 'guestsNumberPerYear', priceFactors.guestsNumberPerYear); // prettier-ignore
      },
    );
  });

  test.describe('validation', () => {
    test('first name cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFormFieldFocus('firstName');
    });

    test('last name cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFormFieldFocus('lastName');
    });

    test('email cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFormFieldFocus('email');
    });

    test('email has to have correct format', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: 'incorrect_format',
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFormFieldFocus('email');
    });

    test('company cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        message: faker.lorem.paragraph(),
      });
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFormFieldFocus('company');
    });

    test.fail('message cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
      });
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFormFieldFocus('message');
    });

    test('number of aircrafts cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactors({
        oneWayPerYear: faker.number.int(10000),
        guestsNumberPerYear: faker.number.int(1000000),
      });
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasPriceFactorFocus('aircraftsNumber');
    });

    test('number of aircrafts can be 0', async ({ pricingPage }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactors({
        aircraftsNumber: 0,
        oneWayPerYear: faker.number.int(10000),
        guestsNumberPerYear: faker.number.int(1000000),
      });
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible();
    });

    test.fail(
      'number of aircrafts cannot be negative',
      async ({ pricingPage }) => {
        await pricingPage.fillFormDefaultValues();
        await pricingPage.fillPriceFactors({
          aircraftsNumber: -faker.number.int(200),
          oneWayPerYear: faker.number.int(10000),
          guestsNumberPerYear: faker.number.int(1000000),
        });
        await pricingPage.submit();

        await pricingPage.isSuccessPopUpVisible(false);
        await pricingPage.hasPriceFactorFocus('aircraftsNumber');
      },
    );

    test('number of one way flights per year cannot be empty', async ({
      pricingPage,
    }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactors({
        aircraftsNumber: faker.number.int(200),
        guestsNumberPerYear: faker.number.int(1000000),
      });
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasPriceFactorFocus('oneWayPerYear');
    });

    test('number of one way flights per year can be 0', async ({
      pricingPage,
    }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactors({
        aircraftsNumber: faker.number.int(200),
        oneWayPerYear: 0,
        guestsNumberPerYear: faker.number.int(1000000),
      });
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible();
    });

    test.fail(
      'number of one way flights per year cannot be negative',
      async ({ pricingPage }) => {
        await pricingPage.fillFormDefaultValues();
        await pricingPage.fillPriceFactors({
          aircraftsNumber: faker.number.int(200),
          oneWayPerYear: -faker.number.int(10000),
          guestsNumberPerYear: faker.number.int(1000000),
        });
        await pricingPage.submit();

        await pricingPage.isSuccessPopUpVisible(false);
        await pricingPage.hasPriceFactorFocus('aircraftsNumber');
      },
    );

    test('number of guests per year cannot be empty', async ({
      pricingPage,
    }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactors({
        aircraftsNumber: faker.number.int(200),
        oneWayPerYear: faker.number.int(10000),
      });
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasPriceFactorFocus('guestsNumberPerYear');
    });

    test('number of guests per year can be 0', async ({ pricingPage }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactors({
        aircraftsNumber: faker.number.int(200),
        oneWayPerYear: faker.number.int(10000),
        guestsNumberPerYear: 0,
      });
      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible();
    });

    test.fail(
      'number of guests per year cannot be negative',
      async ({ pricingPage }) => {
        await pricingPage.fillFormDefaultValues();
        await pricingPage.fillPriceFactors({
          aircraftsNumber: faker.number.int(200),
          oneWayPerYear: faker.number.int(10000),
          guestsNumberPerYear: -faker.number.int(1000000),
        });
        await pricingPage.submit();

        await pricingPage.isSuccessPopUpVisible(false);
        await pricingPage.hasPriceFactorFocus('aircraftsNumber');
      },
    );
  });

  test.describe('modules', () => {
    test('are checked in default', async ({ pricingPage }) => {
      await pricingPage.areModulesChecked();
    });

    test('can be unchecked', async ({ pricingPage }) => {
      await pricingPage.uncheckElement('platform');
      await pricingPage.uncheckElement('routeOptimization');

      await pricingPage.isChecked('platform', false);
      await pricingPage.isChecked('routeOptimization', false);

      // Checked in default
      await pricingPage.isChecked('loadPlanning');
      await pricingPage.isChecked('mealPlanning');
    });

    test('can be unchecked and checked again', async ({ pricingPage }) => {
      await pricingPage.uncheckElement('loadPlanning');
      await pricingPage.uncheckElement('mealPlanning');

      await pricingPage.isChecked('loadPlanning', false);
      await pricingPage.isChecked('mealPlanning', false);

      await pricingPage.checkElement('loadPlanning');
      await pricingPage.checkElement('mealPlanning');

      await pricingPage.isChecked('loadPlanning');
      await pricingPage.isChecked('mealPlanning');
    });
  });

  test.describe('communication checkbox', () => {
    test('is checked in default', async ({ pricingPage }) => {
      await pricingPage.isChecked('communication');
    });

    test('can be unchecked', async ({ pricingPage }) => {
      await pricingPage.uncheckElement('communication');

      await pricingPage.isChecked('communication', false);
    });

    test('can be unchecked and checked again', async ({ pricingPage }) => {
      await pricingPage.uncheckElement('communication');

      await pricingPage.isChecked('communication', false);

      await pricingPage.checkElement('communication');

      await pricingPage.isChecked('communication');
    });
  });
});
