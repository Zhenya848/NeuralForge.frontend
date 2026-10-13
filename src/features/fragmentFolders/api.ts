import { baseApi, FEED_SERVICE_FRAGMENT_FOLDERS_API_URL } from "@/app/baseApi";
import type { Envelope } from "@/shared/api/Envelope";

export const fragmentFolderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        create: builder.mutation<Envelope<string>, { name: string, emojiId: number, parentId?: string, projectId?: string }>({
            query: ({ name, emojiId, parentId, projectId }) => {
                return {
                    url: FEED_SERVICE_FRAGMENT_FOLDERS_API_URL,
                    method: 'POST',
                    body: { name, emojiId, parentId, projectId },
                };
            }
        }),
        delete: builder.query<Envelope<string>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: FEED_SERVICE_FRAGMENT_FOLDERS_API_URL + id,
                    method: 'DELETE'
                };
            }
        }),
        update: builder.mutation<Envelope<string>, { id: string, name: string, emojiId: string }>({
            query: ({ id, name, emojiId }) => {
                return {
                    url: FEED_SERVICE_FRAGMENT_FOLDERS_API_URL + id,
                    method: 'PUT',
                    body: { name, emojiId }
                };
            }
        })
    })
});

export const { 
    useCreateMutation,
    useDeleteQuery,
    useUpdateMutation
 } = fragmentFolderApi;