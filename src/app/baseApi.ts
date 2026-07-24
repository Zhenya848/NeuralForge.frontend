import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { AppState } from "./store";
import type { Envelope } from "../shared/api/Envelope";
import type { LoginResponse } from "../features/accounts/responses/LoginResponse";
import { setCredentials } from "./auth.slice";

export const FEED_SERVICE_PROJECTS_API_URL = "/api/Projects/"
export const USER_SERVICE_API_URL = "/api/Auth/";
export const PAYMENT_SERVICE_API_URL = "/api/Payments/";

const baseQuery = fetchBaseQuery({
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as AppState).auth.accessToken;

        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);
        }

        return headers;
    }
});

const baseQueryWithRefresh: typeof baseQuery = async (args, api, extraOptions) => {
    let response = await baseQuery(args, api, extraOptions);

    if (response.error && response.error.status === 401) {
        const authResponse = await baseQuery(
            {
                url: USER_SERVICE_API_URL + "refresh-token",
                method: "POST"
            },
            api,
            extraOptions
        );

        if (authResponse.error) {
            window.location.href = '/login';

            return response;
        }

        const data = authResponse.data as Envelope<LoginResponse>;

        api.dispatch(setCredentials({ accessToken: data.result!.accessToken, user: data.result!.user }))

        response = await baseQuery(args, api, extraOptions);
    }

    return response;
}

export const baseApi = createApi({
    baseQuery: baseQueryWithRefresh,
    endpoints: () => ({}),
    tagTypes: ["Acts"]
})