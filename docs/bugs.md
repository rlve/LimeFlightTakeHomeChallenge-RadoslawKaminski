# Bug Report

## 1. Form Fields Not Cleared After Successful Submission

**Module**: Contact Form & Pricing Form

**Test Environment**: `https://test.limeflight.com/`

**Description**:
The contact form retains previously entered data after a user reopens the form following a successful submission. According to the expected behavior, all form fields should be cleared, and the form should reset to default values.

**Steps to Reproduce**:

- Navigate to the contact form (or pricing form) page.
- Fill in all fields using the default provided values.
- Submit the form.
- Wait for the success pop-up and confirm it is visible.
- Close the success pop-up.
- Reopen the contact form.

**Expected Result**: All form fields should be empty when the contact form is reopened after a successful submission.

**Actual Result**:
The fields retain the data entered in the previous session after the form is reopened.

## 2. Validation inconsitency: Form Submits Successfully Without Message Content (?)

**Module**: Contact Form & Pricing Form

**Test Environment**: `https://test.limeflight.com/`

**Description**:
The contact form submission enforces the requirement for the 'message' field to be filled.

The pricing form submission does not enforce the requirement for the 'message' field to be filled.

The form should not submit successfully and should instead highlight the empty 'message' field, indicating the need for user input.

**Steps to Reproduce**:

- Access the Pricing Page.
- Fill in the 'firstName', 'lastName', 'email', and 'company' fields with valid data.
- Leave the 'message' field empty.
- Fill in all required price factors with default values.
- Submit the form.

**Expected Result**:
The form submission should fail, and the 'message' field should gain focus, indicating that it cannot be empty.

**Actual Result**:
The form submits successfully without any content in the 'message' field, and there is no indication that the field is required.

## 3. Negative Values Accepted for Price Factors

**Module**: Pricing Form

**Test Environment**: `https://test.limeflight.com/`

**Description**:
The pricing form erroneously accepts negative values for the Price Factors fields during data submission. The Price Factors should not be negative as it represents a quantity. The form should validate this field to ensure that only non-negative integers are submitted.

**Steps to Reproduce**:

- Navigate to the pricing form page.
- Fill in the form with default values.
- Enter a negative number for one of the Price Factors fields (e.g., -100).
- Fill in the other Price Factors with valid numbers.
- Submit the form.

**Expected Result**: The form submission should fail, and focus should be set on the 'Price Factors' field with an indication that negative values are not allowed.

**Actual Result**:
The form accepts the negative value for 'Price Factors' and attempts to submit, leading to an erroneous state without proper focus on the 'Price Factors' field.

## 4. Fields Missing and Data Mismatch in POST Request

**Module**: Pricing Form

**Test Environment**: `https://test.limeflight.com/`

**Description**:
Upon successful submission of the pricing form, the POST request generated is missing the 'message' field and incorrectly swaps the data for 'number of one way flights per year' with 'number of guests per year'.

**Steps to Reproduce**:

1. Navigate to the pricing form.
2. Fill in all fields with valid data, including personal details and price factors.
3. Submit the form.
4. Inspect the data payload of the POST request sent upon form submission.

**Expected Result**:
The POST request should accurately reflect all user inputs:

- `firstName` matches entered first name.
- `lastName` matches entered last name.
- `email` matches entered email.
- `company` matches entered company name.
- `message` includes the user-entered message.
- All modules and price factors should be correctly represented and matched with their respective values.

**Actual Result**:

- The `message` field is missing entirely from the POST request.
- The values for `oneWayPerYear` and `guestsNumberPerYear` are swapped, leading to incorrect data submission.
