import { baseApi, FEED_SERVICE_CHAT_FOLDERS_API_URL, FEED_SERVICE_PROJECTS_API_URL } from "@/app/baseApi";
import type { Envelope } from "@/shared/api/Envelope";

export const chatFolderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createChatFolder: builder.mutation<Envelope<string>, { name: string, emojiId: number, projectId?: string, parentId?: string }>({
            query: ({ name, emojiId, projectId, parentId }) => {
                return {
                    url: FEED_SERVICE_CHAT_FOLDERS_API_URL,
                    method: 'POST',
                    body: { name, emojiId, projectId, parentId },
                };
            }
        }),
        deleteChatFolder: builder.mutation<Envelope<string>, { id: string }>({
            query: ({ id }) => {
                return {
                    url: FEED_SERVICE_CHAT_FOLDERS_API_URL + id,
                    method: 'DELETE'
                };
            }
        }),
        updateChatFolder: builder.mutation<Envelope<string>, { id: string, name: string, emojiId: number, parentId?: string, projectId?: string }>({
            query: ({ id, name, emojiId, parentId, projectId }) => {
                return {
                    url: FEED_SERVICE_CHAT_FOLDERS_API_URL + id,
                    method: 'PUT',
                    body: { name, emojiId, parentId, projectId }
                };
            }
        })
    })
});

export const { 
    useCreateChatFolderMutation,
    useDeleteChatFolderMutation,
    useUpdateChatFolderMutation
 } = chatFolderApi;