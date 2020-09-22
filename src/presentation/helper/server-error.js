class ServerError extends Error {
  constructor() {
    super(`Internal Error`);
    this.name = 'ServeError';
  }
}

module.exports = ServerError;
