import type { User } from "../../../entities/accounts/User";

export type LoginResponse = {
    accessToken: string;
    user: User;
}