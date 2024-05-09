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

    await contactPage.hasBeenSubmittedSuccesfully();
  });
});
