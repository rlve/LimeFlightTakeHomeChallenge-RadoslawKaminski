Feature: Pricing form interaction

  Scenario: Submitting the pricing form with correct data
    Given the user is on the Pricing Page
    And the form and price factors are filled with default values
    When the user submits the form
    Then a success pop-up should be visible

  Scenario: Submitting the pricing form with modules unchecked
    Given the user is on the Pricing Page
    And the form and price factors are filled with default values
    And the user has unchecked some modules
    When the user submits the form
    Then a success pop-up should be visible

  Scenario: Submitting the pricing form with the communication checkbox unchecked
    Given the user is on the Pricing Page
    And the form and price factors are filled with default values
    And the communication checkbox is unchecked
    When the user submits the form
    Then a success pop-up should be visible

  Scenario: Clearing the form after successful submission
    Given the user has successfully submitted the pricing form
    When the user reopens the form
    Then the form should be cleared

  Scenario Outline: Required fields validation for pricing form
    Given the user is on the Pricing Page
    And the "<field>" field is empty
    And the rest of the fields have default values
    When the user attempts to submit the pricing form
    Then the form should not be submitted
    And the focus should be on the "<field>" field

    Examples:
      | field                     |
      | first name                |
      | last name                 |
      | email                     |
      | company                   |
      | message                   |
      | number of aircrafts       |
      | number of one way flights per year |
      | number of guests per year |

  Scenario: Email format validation
    Given the user is on the Pricing Page
    And the user enters "incorrect_format" as the email
    And the rest of the fields have default values
    When the user submits the form
    Then the form should not be submitted
    And the focus should be on the email field

  Scenario Outline: Validating numerical fields for zero or negative values
    Given the user is on the Pricing Page
    And the "<field>" is set to "<value>"
    And the rest of the fields have default values
    When the user attempts to submit the pricing form
    Then the submission should "<outcome>"
    And if the submission fails, focus should be on the "<field>"

    Examples:
      | field                             | value | outcome |
      | number of aircrafts               | 0     | succeed |
      | number of aircrafts               | -1    | fail    |
      | number of one way flights per year| 0     | succeed |
      | number of one way flights per year| -10   | fail    |
      | number of guests per year         | 0     | succeed |
      | number of guests per year         | -1000 | fail    |

 Scenario: Modules are checked in default on pricing form 
    Given the user is on the Pricing Page
    Then the modules checkboxes should be checked

 Scenario: Modules can be unchecked on pricing form 
    Given the user is on the Pricing Page
    When the user unchecks the platform checkbox
    Then the platform checkbox should be unchecked

  Scenario: Modules can be unchecked and checked again on pricing form 
    Given the user is on the Pricing Page
    When the user unchecks the platform checkbox
    And the user checks the platform checkbox again
    Then the platform checkbox should be checked

Scenario: Communication checkbox is checked in default on pricing form 
    Given the user is on the Pricing Page
    Then the communication checkbox should be checked

Scenario: Communication can be unchecked on pricing form 
    Given the user is on the Pricing Page
    When the user unchecks the communication checkbox
    Then the communication checkbox should be unchecked

Scenario: Communication can be unchecked and checked again on pricing form 
    Given the user is on the Pricing Page
    When the user unchecks the communication checkbox
    And the user checks the communication checkbox again
    Then the communication checkbox should be checked

