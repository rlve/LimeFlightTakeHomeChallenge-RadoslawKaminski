import { test } from '../lib/fixtures';
import { faker } from '@faker-js/faker';

test.describe.configure({ mode: 'parallel' });

test.describe('Contact form', () => {
  test.describe('opening', () => {
    test('form can be open using Contact Sales button', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm('contactSales');

      await contactPage.isFormOpen();
    });

    test('form can be open using Get Started button', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm('getStarted');

      await contactPage.isFormOpen();
    });

    test('form can be open using Get Started button with email populated', async ({
      contactPage,
    }) => {
      const email = faker.internet.email();
      await contactPage.enterEmailToGetStarted(email);
      await contactPage.openContactForm('getStarted');

      await contactPage.isFormOpen();
      await contactPage.hasFormFieldValue('email', email);
    });

    test('form can be closed', async ({ contactPage }) => {
      await contactPage.openContactForm();

      await contactPage.isFormOpen();

      await contactPage.closeContactForm();

      await contactPage.isFormClosed();
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

      await contactPage.isFormOpen();
      await contactPage.hasFormFieldValue('firstName', data.firstName);
      await contactPage.hasFormFieldValue('lastName', data.lastName);
      await contactPage.hasFormFieldValue('email', data.email);
      await contactPage.hasFormFieldValue('company', data.company);
      await contactPage.hasFormFieldValue('message', data.message);
    });
  });

  test.describe('submission', () => {
    test('can be submitted succesfully with correct data', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();
      await contactPage.fillFormDefaultValues();
      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible();
    });

    test('can be submitted succesfully with modules unchecked', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();
      await contactPage.fillFormDefaultValues();
      await contactPage.uncheckModules();
      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible();
    });

    test('can be submitted succesfully with communication checkbox unchecked', async ({
      contactPage,
    }) => {
      await contactPage.openContactForm();
      await contactPage.fillFormDefaultValues();
      await contactPage.uncheckElement('communication');
      await contactPage.submit();

      await contactPage.isSuccessPopUpVisible();
    });

    test.fail(
      'clears the form after succesfull submission',
      async ({ contactPage }) => {
        await contactPage.openContactForm();
        await contactPage.fillFormDefaultValues();
        await contactPage.submit();
        await contactPage.isSuccessPopUpVisible();

        await contactPage.closeSuccessPopUp();
        await contactPage.openContactForm();

        await contactPage.hasFormFieldValue('firstName', '');
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

      contactPage.areFieldsInRequest(request, 'firstname', data.firstName);
      contactPage.areFieldsInRequest(request, 'lastname', data.lastName);
      contactPage.areFieldsInRequest(request, 'email', data.email);
      contactPage.areFieldsInRequest(request, 'company', data.company);
      contactPage.areFieldsInRequest(request, 'message', data.message);
      contactPage.areModulesInRequest(request, 'platform');
      contactPage.areModulesInRequest(request, 'loadPlanning');
      contactPage.areModulesInRequest(request, 'mealPlanning');
      contactPage.areModulesInRequest(request, 'mobileApp');
      contactPage.areModulesInRequest(request, 'inventoryManagement');
      contactPage.areModulesInRequest(request, 'routeOptimization');
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

      await contactPage.isSuccessPopUpVisible(false);
      await contactPage.hasFormFieldFocus('firstName');
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
      await contactPage.hasFormFieldFocus('lastName');
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
      await contactPage.hasFormFieldFocus('email');
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
      await contactPage.hasFormFieldFocus('email');
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
      await contactPage.hasFormFieldFocus('company');
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
      await contactPage.hasFormFieldFocus('message');
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
