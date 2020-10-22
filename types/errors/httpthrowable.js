class HttpThrowableError extends Error {
  constructor(message, statusCode = 500, publicOutput = 'Ой, кажется что-то пошло не так') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.publicOutput = publicOutput;
  }
}

module.exports = HttpThrowableError;
