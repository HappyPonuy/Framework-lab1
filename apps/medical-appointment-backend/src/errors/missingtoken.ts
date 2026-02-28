import { BaseError } from "./base.js";

export class MissingTokenError extends BaseError {
    constructor() {
        super("Token missing", 400);
    }
}