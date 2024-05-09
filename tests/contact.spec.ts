import { expect } from '@playwright/test';
import { test } from '../lib/fixtures';
import { faker } from '@faker-js/faker';

test.describe('Contact form', () => {
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
});
