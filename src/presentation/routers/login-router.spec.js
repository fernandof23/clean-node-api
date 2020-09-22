/* eslint-disable max-classes-per-file */

const LoginRouter = require('./login-router');
const MissingParamError = require('../helper/missing-param-error');
const UnauthorizedError = require('../helper/unauthorized-error');

const makeSut = () => {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy();
  const sut = new LoginRouter(authUseCaseSpy);
  return {
    sut,
    authUseCaseSpy,
  };
};

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();

    const httpRespost = sut.route();

    expect(httpRespost.statusCode).toBe(500);
  });

  test('Should return 500 if no httpRequest has no body', () => {
    const { sut } = makeSut();

    const httpRequest = {};

    const httpRespost = sut.route(httpRequest);

    expect(httpRespost.statusCode).toBe(500);
  });

  test('Should call AuthUseCase with a correct Params', () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test('Should return 401 when invalid credentials are provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password',
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });
});
