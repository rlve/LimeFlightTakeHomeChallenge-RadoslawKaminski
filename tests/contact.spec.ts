import { expect } from '@playwright/test';
import { test } from '../lib/fixtures';
import { faker } from '@faker-js/faker';

test.describe('Contact form', () => {
  test.describe('submission', () => {
    test('can be submitted succesfully with correct data', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();

      await contactPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible();
    });

    test('can be submitted succesfully with modules unchecked', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();

      await contactPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await contactPage.uncheckModules();

      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible();
    });

    test('can be submitted succesfully with communication checkbox unchecked', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();

      await contactPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await contactPage.uncheckElement('communication');

      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible();
    });

    // another button
  });

  test.describe('validation', () => {
    test('first name cannot be empty', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.fillForm({
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible(false);
      await contactPage.hasFocus('firstName');
    });

    test('last name cannot be empty', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.fillForm({
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible(false);
      await contactPage.hasFocus('lastName');
    });

    test('email cannot be empty', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible(false);
      await contactPage.hasFocus('email');
    });

    test('email has to have correct format', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: 'incorrect_format',
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      });

      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible(false);
      await contactPage.hasFocus('email');
    });

    test('company cannot be empty', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        message: faker.lorem.paragraph(),
      });

      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible(false);
      await contactPage.hasFocus('company');
    });

    test('message cannot be empty', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.fillForm({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
      });

      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible(false);
      await contactPage.hasFocus('message');
    });
  });

  test.describe('modules', () => {
    test('are checked in default', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.areModulesChecked();
    });

    test('can be unchecked', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.uncheckElement('platform');
      await contactPage.uncheckElement('routeOptimization');

      await contactPage.isChecked('platform', false);
      await contactPage.isChecked('routeOptimization', false);

      // Checked in default
      await contactPage.isChecked('loadPlanning');
      await contactPage.isChecked('mealPlanning');
    });

    test('can be unchecked and checked again', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.uncheckElement('loadPlanning');
      await contactPage.uncheckElement('mealPlanning');

      await contactPage.isChecked('loadPlanning', false);
      await contactPage.isChecked('mealPlanning', false);

      await contactPage.checkElement('loadPlanning');
      await contactPage.checkElement('mealPlanning');

      await contactPage.isChecked('loadPlanning');
      await contactPage.isChecked('mealPlanning');
    });
  });

  test.describe('communication checkbox', () => {
    test('is checked in default', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.isChecked('communication');
    });

    test('can be unchecked', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.uncheckElement('communication');

      await contactPage.isChecked('communication', false);
    });

    test('can be unchecked and checked again', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.uncheckElement('communication');

      await contactPage.isChecked('communication', false);

      await contactPage.checkElement('communication');

      await contactPage.isChecked('communication');
    });
  });
});
