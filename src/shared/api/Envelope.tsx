import type { Error } from "../api/Error";

export type Envelope<T> = {
    result: T | null;
    responseErrors: Error[];
    time: Date | null;
}