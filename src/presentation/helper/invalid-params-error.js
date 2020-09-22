class InvalidParamsError {
  constructor(params) {
    this.super(`${params} invalido`);
    this.name = 'InvalidParamsError';
  }
}

module.exports = InvalidParamsError;
