/* eslint-disable max-classes-per-file */

const LoginRouter = require('./login-router');
const MissingParamError = require('../helper/missing-param-error');

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        password: '123456',
      },
    };
    const httpRespost = sut.route(httpRequest);

    expect(httpRespost.statusCode).toBe(400);
    expect(httpRespost.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: 'johndoe@johndoe.com',
      },
    };
    const httpRespost = sut.route(httpRequest);

    expect(httpRespost.statusCode).toBe(400);
    expect(httpRespost.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 500 if no httpRequest is provided', () => {
    const sut = new LoginRouter();

    const httpRespost = sut.route();

    expect(httpRespost.statusCode).toBe(500);
  });

  test('Should return 500 if no httpRequest has no body', () => {
    const sut = new LoginRouter();

    const httpRequest = {};

    const httpRespost = sut.route(httpRequest);

    expect(httpRespost.statusCode).toBe(500);
  });
});
