export class BadRequestError extends Error {
  constructor() {
    super();
    this.name = "BadRequestError";
    this.status = 400;
    this.message = "Please make call with valid post data.";
  }
}
