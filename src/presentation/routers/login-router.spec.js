/* eslint-disable max-classes-per-file */

const LoginRouter = require('./login-router');
const MissingParamError = require('../helper/missing-param-error');
const UnauthorizedError = require('../helper/unauthorized-error');
const ServerError = require('../helper/server-error');
// const InvalidParamsError = require('../helper/invalid-params-error');

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }

  return new AuthUseCaseSpy();
};

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth() {
      throw new Error();
    }
  }

  return new AuthUseCaseSpy();
};

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();
  authUseCaseSpy.accessToken = 'valid_token';
  const sut = new LoginRouter(authUseCaseSpy);
  return {
    sut,
    authUseCaseSpy,
  };
};

describe('Login Router', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: '123456',
      },
    };
    const httpRespost = await sut.route(httpRequest);

    expect(httpRespost.statusCode).toBe(400);
    expect(httpRespost.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'johndoe@johndoe.com',
      },
    };
    const httpRespost = await sut.route(httpRequest);

    expect(httpRespost.statusCode).toBe(400);
    expect(httpRespost.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut();

    const httpRespost = await sut.route();

    expect(httpRespost.statusCode).toBe(500);
    expect(httpRespost.body).toEqual(new ServerError());
  });

  test('Should return 500 if no httpRequest has no body', async () => {
    const { sut } = makeSut();

    const httpRequest = {};

    const httpRespost = await sut.route(httpRequest);

    expect(httpRespost.statusCode).toBe(500);
    expect(httpRespost.body).toEqual(new ServerError());
  });

  test('Should call AuthUseCase with a correct Params', async () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    await sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password',
      },
    };

    authUseCaseSpy.accessToken = null;

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test('Should return 500 if no AuthUseCase is provided', async () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should return 500 if no AuthUseCase has no auth method', async () => {
    class AuthUseCaseSpy {}

    const authUseCaseSpy = new AuthUseCaseSpy();

    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should return 500 if no AuthUseCase throw', async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError();

    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  /* test('Should return 400 if an invalid email provider', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'valid_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'));
  }); */
});
