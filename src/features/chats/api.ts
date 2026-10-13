import { baseApi, FEED_SERVICE_CHATS_API_URL } from "@/app/baseApi";
import type { Envelope } from "@/shared/api/Envelope";

export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createChat: builder.mutation<Envelope<string>, { name: string, emojiId: number, projectId?: string, folderId?: string }>({
            query: ({ name, emojiId, projectId, folderId }) => {
                return {
                    url: FEED_SERVICE_CHATS_API_URL,
                    method: 'POST',
                    body: { name, emojiId, projectId, folderId },
                };
            },
            invalidatesTags: ["Chats"],
        }),
        deleteChat: builder.mutation<Envelope<string>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: FEED_SERVICE_CHATS_API_URL + id,
                    method: 'DELETE'
                };
            }
        }),
        updateChat: builder.mutation<Envelope<string>, { id: string, name: string, projectId?: string, folderId?: string }>({
            query: ({ id, name, projectId, folderId }) => {
                return {
                    url: FEED_SERVICE_CHATS_API_URL + id,
                    method: 'PUT',
                    body: { id, name, projectId, folderId }
                };
            }
        }),
    })
});

export const { 
    useCreateChatMutation,
    useDeleteChatMutation,
    useUpdateChatMutation
 } = chatApi;