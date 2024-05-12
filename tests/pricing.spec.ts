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

      await pricingPage.assertSuccessPopUpVisible();
    });

    test('can be submitted succesfully with modules unchecked', async ({
      pricingPage,
    }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.uncheckModules();
      await pricingPage.submit();

      await pricingPage.assertSuccessPopUpVisible();
    });

    test('can be submitted succesfully with communication checkbox unchecked', async ({
      pricingPage,
    }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactorsDefaultValues();
      await pricingPage.uncheckElement('communication');
      await pricingPage.submit();

      await pricingPage.assertSuccessPopUpVisible();
    });

    test.fail(
      'clears the form after succesfull submission',
      async ({ pricingPage }) => {
        await pricingPage.fillFormDefaultValues();
        await pricingPage.fillPriceFactorsDefaultValues();
        await pricingPage.submit();

        await pricingPage.assertSuccessPopUpVisible();

        await pricingPage.closeSuccessPopUp();

        await pricingPage.assertFormFieldValue('firstName', '');
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

        pricingPage.assertFieldsInRequest(
          request,
          'firstname',
          fields.firstName,
        );
        pricingPage.assertFieldsInRequest(request, 'lastname', fields.lastName);
        pricingPage.assertFieldsInRequest(request, 'email', fields.email);
        pricingPage.assertFieldsInRequest(request, 'company', fields.company);
        pricingPage.assertFieldsInRequest(request, 'message', fields.message); // fail: missing message
        pricingPage.assertModulesInRequest(request, 'platform');
        pricingPage.assertModulesInRequest(request, 'loadPlanning');
        pricingPage.assertModulesInRequest(request, 'mealPlanning');
        pricingPage.assertModulesInRequest(request, 'mobileApp');
        pricingPage.assertModulesInRequest(request, 'inventoryManagement');
        pricingPage.assertModulesInRequest(request, 'routeOptimization');
        pricingPage.assertPriceFactorsInRequest(request, 'aircraftsNumber', priceFactors.aircraftsNumber); // prettier-ignore
        // fail: number of one way flight is swapped with number of guests
        pricingPage.assertPriceFactorsInRequest(request, 'oneWayPerYear', priceFactors.oneWayPerYear); // prettier-ignore
        pricingPage.assertPriceFactorsInRequest(request, 'guestsNumberPerYear', priceFactors.guestsNumberPerYear); // prettier-ignore
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

      await pricingPage.assertSuccessPopUpVisible(false);
      await pricingPage.assertFormFieldFocus('firstName');
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

      await pricingPage.assertSuccessPopUpVisible(false);
      await pricingPage.assertFormFieldFocus('lastName');
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

      await pricingPage.assertSuccessPopUpVisible(false);
      await pricingPage.assertFormFieldFocus('email');
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

      await pricingPage.assertSuccessPopUpVisible(false);
      await pricingPage.assertFormFieldFocus('email');
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

      await pricingPage.assertSuccessPopUpVisible(false);
      await pricingPage.assertFormFieldFocus('company');
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

      await pricingPage.assertSuccessPopUpVisible(false);
      await pricingPage.assertFormFieldFocus('message');
    });

    test('number of aircrafts cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactors({
        oneWayPerYear: faker.number.int(10000),
        guestsNumberPerYear: faker.number.int(1000000),
      });
      await pricingPage.submit();

      await pricingPage.assertSuccessPopUpVisible(false);
      await pricingPage.assertPriceFactorFocus('aircraftsNumber');
    });

    test('number of aircrafts can be 0', async ({ pricingPage }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactors({
        aircraftsNumber: 0,
        oneWayPerYear: faker.number.int(10000),
        guestsNumberPerYear: faker.number.int(1000000),
      });
      await pricingPage.submit();

      await pricingPage.assertSuccessPopUpVisible();
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

        await pricingPage.assertSuccessPopUpVisible(false);
        await pricingPage.assertPriceFactorFocus('aircraftsNumber');
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

      await pricingPage.assertSuccessPopUpVisible(false);
      await pricingPage.assertPriceFactorFocus('oneWayPerYear');
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

      await pricingPage.assertSuccessPopUpVisible();
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

        await pricingPage.assertSuccessPopUpVisible(false);
        await pricingPage.assertPriceFactorFocus('aircraftsNumber');
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

      await pricingPage.assertSuccessPopUpVisible(false);
      await pricingPage.assertPriceFactorFocus('guestsNumberPerYear');
    });

    test('number of guests per year can be 0', async ({ pricingPage }) => {
      await pricingPage.fillFormDefaultValues();
      await pricingPage.fillPriceFactors({
        aircraftsNumber: faker.number.int(200),
        oneWayPerYear: faker.number.int(10000),
        guestsNumberPerYear: 0,
      });
      await pricingPage.submit();

      await pricingPage.assertSuccessPopUpVisible();
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

        await pricingPage.assertSuccessPopUpVisible(false);
        await pricingPage.assertPriceFactorFocus('aircraftsNumber');
      },
    );
  });

  test.describe('modules', () => {
    test('are checked in default', async ({ pricingPage }) => {
      await pricingPage.assertModulesChecked();
    });

    test('can be unchecked', async ({ pricingPage }) => {
      await pricingPage.uncheckElement('platform');
      await pricingPage.uncheckElement('routeOptimization');

      await pricingPage.assertChecked('platform', false);
      await pricingPage.assertChecked('routeOptimization', false);

      // Checked in default
      await pricingPage.assertChecked('loadPlanning');
      await pricingPage.assertChecked('mealPlanning');
    });

    test('can be unchecked and checked again', async ({ pricingPage }) => {
      await pricingPage.uncheckElement('loadPlanning');
      await pricingPage.uncheckElement('mealPlanning');

      await pricingPage.assertChecked('loadPlanning', false);
      await pricingPage.assertChecked('mealPlanning', false);

      await pricingPage.checkElement('loadPlanning');
      await pricingPage.checkElement('mealPlanning');

      await pricingPage.assertChecked('loadPlanning');
      await pricingPage.assertChecked('mealPlanning');
    });
  });

  test.describe('communication checkbox', () => {
    test('is checked in default', async ({ pricingPage }) => {
      await pricingPage.assertChecked('communication');
    });

    test('can be unchecked', async ({ pricingPage }) => {
      await pricingPage.uncheckElement('communication');

      await pricingPage.assertChecked('communication', false);
    });

    test('can be unchecked and checked again', async ({ pricingPage }) => {
      await pricingPage.uncheckElement('communication');

      await pricingPage.assertChecked('communication', false);

      await pricingPage.checkElement('communication');

      await pricingPage.assertChecked('communication');
    });
  });
});
