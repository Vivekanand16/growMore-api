export class NotAdminError extends Error {
  constructor() {
    super();
    this.name = "NotAdminError";
    this.status = 401;
    this.message = "You don't have privileges.";
  }
}
