const HttpResponse = require('../helper/http-response');
const MissingParamsError = require('../helper/missing-param-error');
const InvalidParamsError = require('../helper/invalid-params-error');

class LoginRouter {
  constructor(authUseCase, emailValidator) {
    this.authUseCase = authUseCase;
    this.emailValidator = emailValidator;
  }

  async route(httpRequest) {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return HttpResponse.badRequest(new MissingParamsError('email'));
      }

      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamsError('email'));
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamsError('password'));
      }

      const accessToken = await this.authUseCase.auth(email, password);
      if (!accessToken) {
        return HttpResponse.unauthorizedError();
      }
      return HttpResponse.successReturn({ accessToken });
    } catch (e) {
      return HttpResponse.serverError();
    }
  }
}

module.exports = LoginRouter;
