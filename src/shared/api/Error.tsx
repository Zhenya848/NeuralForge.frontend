import type { ErrorType } from "../api/ErrorType";

export type Error = {
    code: string;
    message: string;
    errorType: ErrorType;
    invalidField?: string;
}