Feature: Contact form 

  Scenario Outline: Opening contact form using different buttons
    Given the user is on the Contact Page
    When the user clicks on the <button> button
    Then the contact form should be open

    Examples:
      | button        |
      | Contact Sales |
      | Get Started   |

  Scenario: Opening contact form with email pre-populated
    Given the user is on the Contact Page
    And the user has entered a valid email
    When the user clicks on the "Get Started" button
    Then the contact form should be open
    And the email field should be populated with the entered email

  Scenario: Closing the contact form
    Given the contact form is open
    When the user closes the contact form
    Then the contact form should be closed

  Scenario: Reopening the contact form retains filled data
    Given the user has filled out the contact form and closed it
    When the user reopens the contact form
    Then the form fields should contain the previously entered data

  Scenario: Successful form submission with correct data
    Given the user is on the Contact Page
    And the user has opened the contact form
    And the user has filled out the form with default values
    When the user submits the form
    Then a success pop-up should be visible

  Scenario: Successful form submission with modules unchecked
    Given the user is on the Contact Page
    And the user has opened the contact form
    And the user has unchecked certain modules in the form
    When the user submits the form
    Then a success pop-up should be visible

  Scenario: Successful form submission with communication checkbox unchecked
    Given the user is on the Contact Page
    And the user has opened the contact form
    And the communication checkbox is unchecked
    When the user submits the form
    Then a success pop-up should be visible

  Scenario: Form clears after successful submission
    Given the user has successfully submitted the form
    When the user reopens the contact form
    Then all the form fields should be empty

  Scenario Outline: Required fields validation
    Given the user is on the Contact Page
    And the user has opened the contact form
    And the user has left the <field> field empty
    When the user submits the form
    Then the form should not be submitted
    And the focus should be on the <field> field

    Examples:
      | field      |
      | first name |
      | last name  |
      | email      |
      | company    |
      | message    |

  Scenario: Email format validation
    Given the user is on the Contact Page
    And the user has opened the contact form
    And the user enters "incorrect_format" as the email
    When the user submits the form
    Then the form should not be submitted
    And the focus should be on the email field

 Scenario: Modules are checked in default
    Given the user is on the Contact Page
    When the user opens the contact form
    Then the modules checkboxes should be checked

 Scenario: Modules can be unchecked
    Given the user is on the Contact Page
    And the user has opened the contact form
    When the user unchecks the platform checkbox
    Then the platform checkbox should be unchecked

  Scenario: Modules can be unchecked and checked again
    Given the user is on the Contact Page
    And the user has opened the contact form
    When the user unchecks the platform checkbox
    And the user checks the platform checkbox again
    Then the platform checkbox should be checked

Scenario: Communication checkbox is checked in default
    Given the user is on the Contact Page
    When the user opens the contact form
    Then the communication checkbox should be checked

Scenario: Communication can be unchecked
    Given the user is on the Contact Page
    And the user has opened the contact form
    When the user unchecks the communication checkbox
    Then the communication checkbox should be unchecked

Scenario: Communication can be unchecked and checked again
    Given the user is on the Contact Page
    And the user has opened the contact form
    When the user unchecks the communication checkbox
    And the user checks the communication checkbox again
    Then the communication checkbox should be checked


