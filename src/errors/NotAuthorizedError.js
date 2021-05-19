export class NotAuthorizedError extends Error {
  constructor() {
    super();
    this.name = "NotAuthorizedError";
    this.status = 401;
    this.message = "Unauthorized";
  }
}
