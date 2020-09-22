const HttpResponse = require('../helper/http-response');

class LoginRouter {
  constructor(authUseCase) {
    this.authUseCase = authUseCase;
  }

  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError();
    }

    const { email, password } = httpRequest.body;
    if (!email) {
      return HttpResponse.badRequest('email');
    }
    if (!password) {
      return HttpResponse.badRequest('password');
    }

    this.authUseCase.auth(email, password);
    return [];
  }
}

module.exports = LoginRouter;