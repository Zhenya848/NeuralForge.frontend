import { baseApi, FEED_SERVICE_CHATS_API_URL } from "@/app/baseApi";
import type { Envelope } from "@/shared/api/Envelope";
import type { PageList } from "@/shared/api/PageList";

export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        create: builder.mutation<Envelope<string>, { name: string, folderId?: string }>({
            query: ({ name, folderId }) => {
                return {
                    url: FEED_SERVICE_CHATS_API_URL,
                    method: 'POST',
                    body: { name, folderId },
                };
            }
        }),
        delete: builder.query<Envelope<string>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: FEED_SERVICE_CHATS_API_URL + id,
                    method: 'DELETE'
                };
            }
        }),
        update: builder.query<Envelope<string>, { id: string, name: string, folderId?: string }>({
            query: ({ id, name, folderId }) => {
                return {
                    url: FEED_SERVICE_CHATS_API_URL + id,
                    method: 'PUT',
                    body: { id, name, folderId }
                };
            }
        }),
    })
});