export class InternalServerError extends Error {
  constructor(message) {
    super();
    this.name = "InternalServerError";
    this.status = 500;
    this.message = message;
  }
}
