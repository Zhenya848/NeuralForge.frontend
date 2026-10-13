import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { AppState } from "./store";
import type { Envelope } from "../shared/api/Envelope";
import { setCredentials } from "./auth.slice";
import type { LoginResponse } from "@/features/accounts/responses/LoginResponse";

export const FEED_SERVICE_PROJECTS_API_URL = "http://localhost:5296/api/Projects/"
export const FEED_SERVICE_CHAT_FOLDERS_API_URL = "http://localhost:5296/api/ChatFolders/";
export const FEED_SERVICE_FRAGMENT_FOLDERS_API_URL = "/api/FragmentFolders/";
export const FEED_SERVICE_CHATS_API_URL = "http://localhost:5296/api/Chats/";
export const FEED_SERVICE_FRAGMENTS_API_URL = "/api/Fragments/";
export const USER_SERVICE_API_URL = "/api/Auth/";

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
    tagTypes: ["Chats"]
})