describe('registration form', () => {
  const fieldRequiredStr = 'Field is required';
  const fieldInvalidLengthStr = (minLength: number) =>
    `Field must be at least ${minLength} characters long`;
  const fieldInvalidEmailStr = 'Invalid email address';
  const fieldInvalidPasswordMatchStr = 'Passwords do not match';

  const submitButtonSelector = 'button[type="submit"]';
  const matErrorSelector = 'mat-error';
  const cardTitleSelector = 'mat-card-title';
  const userNameInputSelector = 'input[formcontrolname="username"]';
  const emailInputSelector = 'input[formcontrolname="email"]';
  const passwordInputSelector = 'input[formcontrolname="password"]';
  const confirmPasswordInputSelector =
    'input[formcontrolname="confirmPassword"]';
  const fullNameInputSelector = 'input[formcontrolname="fullname"]';

  beforeEach(() => {
    cy.visit('/');
  });

  it('handles the form validation correctly', () => {
    cy.title().should('equal', 'User Registration');

    cy.get(cardTitleSelector).should('have.text', 'User registration');

    // Check the user input field validation
    cy.get(userNameInputSelector).should('not.contain.value');
    cy.get(userNameInputSelector).click();
    cy.get(cardTitleSelector).click();
    cy.get(matErrorSelector).should('contain.text', fieldRequiredStr);

    cy.get(userNameInputSelector).type('us');
    cy.get(matErrorSelector).should('contain.text', fieldInvalidLengthStr(3));

    cy.get(userNameInputSelector).type('er');
    cy.get(matErrorSelector).should('not.exist');

    cy.get(submitButtonSelector).should('be.disabled');

    // Check the email input field validation
    cy.get(emailInputSelector).should('not.contain.value');
    cy.get(emailInputSelector).click();
    cy.get(cardTitleSelector).click();
    cy.contains(fieldRequiredStr);

    cy.get(emailInputSelector).type('test');
    cy.contains(fieldInvalidEmailStr);

    cy.get(emailInputSelector).type('@email.me');
    cy.contains(fieldInvalidEmailStr).should('not.exist');
    cy.contains(fieldRequiredStr).should('not.exist');

    cy.get(submitButtonSelector).should('be.disabled');

    // Check the password input field validation
    cy.get(passwordInputSelector).should('not.contain.value');

    cy.get(passwordInputSelector).click();
    cy.get(cardTitleSelector).click();
    cy.contains(fieldRequiredStr);

    cy.get(passwordInputSelector).type('pa');
    cy.contains(fieldInvalidLengthStr(8));

    cy.get(passwordInputSelector).type('$$word');
    cy.contains(fieldInvalidLengthStr(8)).should('not.exist');
    cy.contains(fieldRequiredStr).should('not.exist');

    cy.get(submitButtonSelector).should('be.disabled');

    // Check the password confirmation input field validation
    cy.get(confirmPasswordInputSelector).should('not.contain.value');

    cy.get(confirmPasswordInputSelector).click();
    cy.get(cardTitleSelector).click();
    cy.contains(fieldRequiredStr);

    cy.get(confirmPasswordInputSelector).type('pa');
    cy.contains(fieldInvalidPasswordMatchStr);

    cy.get(confirmPasswordInputSelector).type('$$word');
    cy.contains(fieldInvalidPasswordMatchStr).should('not.exist');
    cy.contains(fieldRequiredStr).should('not.exist');

    cy.get(confirmPasswordInputSelector).type('{backspace}');
    cy.contains(fieldInvalidPasswordMatchStr);

    cy.get(confirmPasswordInputSelector).type('d');
    cy.contains(fieldInvalidPasswordMatchStr).should('not.exist');

    cy.get(submitButtonSelector).should('be.enabled');

    // Fill in the optional full name input field
    cy.get(fullNameInputSelector).should('not.contain.value');
    cy.get(fullNameInputSelector).type('John Doe');

    // Submit the form
    cy.get(submitButtonSelector).click();
    cy.contains('Registration data received successfully');

    cy.get(userNameInputSelector).should('not.exist');
    cy.get(emailInputSelector).should('not.exist');
    cy.get(passwordInputSelector).should('not.exist');
    cy.get(confirmPasswordInputSelector).should('not.exist');
    cy.get(fullNameInputSelector).should('not.exist');
    cy.get(submitButtonSelector).should('not.exist');
  });

  it('can submit registration form without full name', () => {
    cy.get(userNameInputSelector).type('username');
    cy.get(emailInputSelector).type('test@email.me');
    cy.get(passwordInputSelector).type('pa$$word');
    cy.get(confirmPasswordInputSelector).type('pa$$word');
    cy.get(submitButtonSelector).click();

    cy.contains('Registration data received successfully');

    cy.get(userNameInputSelector).should('not.exist');
    cy.get(emailInputSelector).should('not.exist');
    cy.get(passwordInputSelector).should('not.exist');
    cy.get(confirmPasswordInputSelector).should('not.exist');
    cy.get(fullNameInputSelector).should('not.exist');
    cy.get(submitButtonSelector).should('not.exist');
  });

  it('shows an Network failure error message on failed network', () => {
    cy.intercept('POST', '/register', { forceNetworkError: true }).as(
      'register',
    );

    cy.get(userNameInputSelector).type('username');
    cy.get(emailInputSelector).type('test@email.me');
    cy.get(passwordInputSelector).type('pa$$word');
    cy.get(confirmPasswordInputSelector).type('pa$$word');
    cy.get(submitButtonSelector).click();

    cy.contains('Http failure response');

    cy.get(userNameInputSelector).should('exist');
    cy.get(emailInputSelector).should('exist');
    cy.get(passwordInputSelector).should('exist');
    cy.get(confirmPasswordInputSelector).should('exist');
    cy.get(fullNameInputSelector).should('exist');
    cy.get(submitButtonSelector).should('exist');
  });

  // Mocking the BE implementation - questionable test.
  it('shows an error message on failed registration', () => {
    cy.intercept('POST', '/register', {
      statusCode: 400,
      body: { status: 'error', message: 'Registration data incomplete' },
    }).as('register');

    cy.get(userNameInputSelector).type('username');
    cy.get(emailInputSelector).type('test@email.me');
    cy.get(passwordInputSelector).type('pa$$word');
    cy.get(confirmPasswordInputSelector).type('pa$$word');
    cy.get(submitButtonSelector).click();

    cy.contains('Registration data incomplete');

    cy.get(userNameInputSelector).should('exist');
    cy.get(emailInputSelector).should('exist');
    cy.get(passwordInputSelector).should('exist');
    cy.get(confirmPasswordInputSelector).should('exist');
    cy.get(fullNameInputSelector).should('exist');
    cy.get(submitButtonSelector).should('exist');
  });
});
