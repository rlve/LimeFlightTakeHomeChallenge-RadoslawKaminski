import { test } from '../lib/fixtures';
import { faker } from '@faker-js/faker';

test.describe.configure({ mode: 'parallel' });

test.describe('Pricing form', () => {
  test.describe('submission', () => {
    test('can be submitted succesfully with correct data', async ({
      pricingPage,
    }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible();
    });

    test('can be submitted succesfully with modules unchecked', async ({
      pricingPage,
    }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await pricingPage.uncheckModules();

      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible();
    });

    test('can be submitted succesfully with communication checkbox unchecked', async ({
      pricingPage,
    }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await pricingPage.uncheckElement('communication');

      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible();
    });

    // TODO: Confirm requirements
    test.fail(
      'clears the form after succesfull submission',
      async ({ pricingPage }) => {
        await pricingPage.fillForm({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          company: faker.company.name(),
          message: faker.lorem.paragraph(),
        });

        await pricingPage.submit();

        await pricingPage.isSuccessPopUpVisible();

        await pricingPage.closeSuccessPopUp();
        await pricingPage.hasValue('firstName', '');
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

      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFocus('firstName');
    });

    test('last name cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFocus('lastName');
    });

    test('email cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFocus('email');
    });

    test('email has to have correct format', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: 'incorrect_format',
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFocus('email');
    });

    test('company cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        message: faker.lorem.paragraph(),
      });

      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFocus('company');
    });

    test('message cannot be empty', async ({ pricingPage }) => {
      await pricingPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
      });

      await pricingPage.submit();

      await pricingPage.isSuccessPopUpVisible(false);
      await pricingPage.hasFocus('message');
    });
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
