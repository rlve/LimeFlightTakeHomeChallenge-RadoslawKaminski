import { test } from '../lib/fixtures';
import { faker } from '@faker-js/faker';

test.describe.configure({ mode: 'parallel' });

test.describe('Contact form', () => {
  test.describe('opening', () => {
    test('form can be open using Contact Sales button', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm('contactSales');

      await contactPage.assertFormOpen();
    });

    test('form can be open using Get Started button', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm('getStarted');

      await contactPage.assertFormOpen();
    });

    test('form can be open using Get Started button with email populated', async ({
      contactPage,
    }) => {
      const email = faker.internet.email();
      await contactPage.enterEmailToGetStarted(email);
      await contactPage.openContactForm('getStarted');

      await contactPage.assertFormOpen();
      await contactPage.assertFormFieldValue('email', email);
    });

    test('form can be closed', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.assertFormOpen();

      await contactPage.closeContactForm();

      await contactPage.assertFormClosed();
    });

    test('form can be closed and open again and will persist data', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();

      const data = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      };
      await contactPage.fillForm(data);

      await contactPage.closeContactForm();
      await contactPage.openContactForm();

      await contactPage.assertFormOpen();
      await contactPage.assertFormFieldValue('firstName', data.firstName);
      await contactPage.assertFormFieldValue('lastName', data.lastName);
      await contactPage.assertFormFieldValue('email', data.email);
      await contactPage.assertFormFieldValue('company', data.company);
      await contactPage.assertFormFieldValue('message', data.message);
    });
  });

  test.describe('submission', () => {
    test('can be submitted succesfully with correct data', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();
      await contactPage.fillFormDefaultValues();
      await contactPage.submit();

      await contactPage.assertSuccessPopUpVisible();
    });

    test('can be submitted succesfully with modules unchecked', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();
      await contactPage.fillFormDefaultValues();
      await contactPage.uncheckModules();
      await contactPage.submit();

      await contactPage.assertSuccessPopUpVisible();
    });

    test('can be submitted succesfully with communication checkbox unchecked', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();
      await contactPage.fillFormDefaultValues();
      await contactPage.uncheckElement('communication');
      await contactPage.submit();

      await contactPage.assertSuccessPopUpVisible();
    });

    test.fail(
      'clears the form after succesfull submission',
      async ({ contactPage }) => {
        await contactPage.openContactForm();
        await contactPage.fillFormDefaultValues();
        await contactPage.submit();
        await contactPage.assertSuccessPopUpVisible();

        await contactPage.closeSuccessPopUp();
        await contactPage.openContactForm();

        await contactPage.assertFormFieldValue('firstName', '');
      },
    );

    test('POST request with fields is send to api.hsforms.com when submitted succesfully', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();
      const data = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.paragraph(),
      };
      await contactPage.fillForm(data);

      const requestPromise = contactPage.getRequestPromise();
      await contactPage.submit();
      const request = await requestPromise;

      contactPage.assertFieldsInRequest(request, 'firstname', data.firstName);
      contactPage.assertFieldsInRequest(request, 'lastname', data.lastName);
      contactPage.assertFieldsInRequest(request, 'email', data.email);
      contactPage.assertFieldsInRequest(request, 'company', data.company);
      contactPage.assertFieldsInRequest(request, 'message', data.message);
      contactPage.assertModulesInRequest(request, 'platform');
      contactPage.assertModulesInRequest(request, 'loadPlanning');
      contactPage.assertModulesInRequest(request, 'mealPlanning');
      contactPage.assertModulesInRequest(request, 'mobileApp');
      contactPage.assertModulesInRequest(request, 'inventoryManagement');
      contactPage.assertModulesInRequest(request, 'routeOptimization');
    });
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

      await contactPage.assertSuccessPopUpVisible(false);
      await contactPage.assertFormFieldFocus('firstName');
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

      await contactPage.assertSuccessPopUpVisible(false);
      await contactPage.assertFormFieldFocus('lastName');
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

      await contactPage.assertSuccessPopUpVisible(false);
      await contactPage.assertFormFieldFocus('email');
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

      await contactPage.assertSuccessPopUpVisible(false);
      await contactPage.assertFormFieldFocus('email');
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

      await contactPage.assertSuccessPopUpVisible(false);
      await contactPage.assertFormFieldFocus('company');
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

      await contactPage.assertSuccessPopUpVisible(false);
      await contactPage.assertFormFieldFocus('message');
    });
  });

  test.describe('modules', () => {
    test('are checked in default', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.assertModulesChecked();
    });

    test('can be unchecked', async ({ contactPage }) => {
      await contactPage.openContactForm();
      await contactPage.uncheckElement('platform');
      await contactPage.uncheckElement('routeOptimization');

      await contactPage.assertChecked('platform', false);
      await contactPage.assertChecked('routeOptimization', false);
      // Checked in default
      await contactPage.assertChecked('loadPlanning');
      await contactPage.assertChecked('mealPlanning');
    });

    test('can be unchecked and checked again', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.uncheckElement('loadPlanning');
      await contactPage.uncheckElement('mealPlanning');

      await contactPage.assertChecked('loadPlanning', false);
      await contactPage.assertChecked('mealPlanning', false);

      await contactPage.checkElement('loadPlanning');
      await contactPage.checkElement('mealPlanning');

      await contactPage.assertChecked('loadPlanning');
      await contactPage.assertChecked('mealPlanning');
    });
  });

  test.describe('communication checkbox', () => {
    test('is checked in default', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.assertChecked('communication');
    });

    test('can be unchecked', async ({ contactPage }) => {
      await contactPage.openContactForm();
      await contactPage.uncheckElement('communication');

      await contactPage.assertChecked('communication', false);
    });

    test('can be unchecked and checked again', async ({ contactPage }) => {
      await contactPage.openContactForm();
      await contactPage.uncheckElement('communication');

      await contactPage.assertChecked('communication', false);

      await contactPage.checkElement('communication');

      await contactPage.assertChecked('communication');
    });
  });
});
