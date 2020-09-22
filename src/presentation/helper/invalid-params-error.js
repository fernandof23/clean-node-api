class InvalidParamsError extends Error {
  constructor(params) {
    super(`Invalid param: ${params}`);
    this.name = 'InvalidParamsError';
  }
}

module.exports = InvalidParamsError;
