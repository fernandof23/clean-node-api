const MissingParamError = require('./missing-param-error');
const UnauthorizedError = require('./unauthorized-error');
const ServerError = require('./server-error');

class HttpResponse {
  static badRequest(paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }

  static serverError() {
    return {
      statusCode: 500,
      body: new ServerError(),
    };
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    };
  }

  static successReturn(bodyReturn) {
    return {
      statusCode: 200,
      body: bodyReturn,
    };
  }
}

module.exports = HttpResponse;
