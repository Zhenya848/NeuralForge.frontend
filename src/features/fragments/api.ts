import { baseApi, FEED_SERVICE_FRAGMENTS_API_URL } from "@/app/baseApi";
import type { Envelope } from "@/shared/api/Envelope";

export const fragmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        create: builder.mutation<Envelope<string>, { name: string, content: string, messageId: string, folderId?: string }>({
            query: ({ name, content, messageId, folderId }) => {
                return {
                    url: FEED_SERVICE_FRAGMENTS_API_URL,
                    method: 'POST',
                    body: { name, content, messageId, folderId },
                };
            }
        }),
        delete: builder.query<Envelope<string>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: FEED_SERVICE_FRAGMENTS_API_URL + id,
                    method: 'DELETE'
                };
            }
        }),
        update: builder.mutation<Envelope<string>, { id: string, name: string, folderId?: string }>({
            query: ({ id, name, folderId }) => {
                return {
                    url: FEED_SERVICE_FRAGMENTS_API_URL + id,
                    method: 'PUT',
                    body: { name, folderId }
                };
            }
        })
    })
});

export const { 
    useCreateMutation,
    useDeleteQuery,
    useUpdateMutation
 } = fragmentApi;