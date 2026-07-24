import { baseApi, FEED_SERVICE_PROJECTS_API_URL } from "@/app/baseApi";
import type { Project } from "@/entities/projects/Project";
import type { Envelope } from "@/shared/api/Envelope";
import type { PageList } from "@/shared/api/PageList";

export const collationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        create: builder.mutation<Envelope<string>, { name: string, description: string, emojiId: number, colorId: number }>({
            query: ({ name, description, emojiId, colorId }) => {
                return {
                    url: FEED_SERVICE_PROJECTS_API_URL + `create`,
                    method: 'POST',
                    body: { name, description, emojiId, colorId },
                };
            }
        }),
        getWithChats: builder.query<Envelope<PageList<Project>>, { page: number, pageSize: number, projectNameFilter: string }>({
            query: ({ page, pageSize, projectNameFilter }) => {
                return {
                    url: FEED_SERVICE_PROJECTS_API_URL + `projects/chats/get?Page=${page}&PageSize=${pageSize}&ProjectNameFilter=${projectNameFilter}`,
                    method: 'GET'
                };
            }
        }),
        getWithFragments: builder.query<Envelope<PageList<Project>>, { page: number, pageSize: number, projectNameFilter: string, nameFilter: string }>({
            query: ({ page, pageSize, projectNameFilter, nameFilter }) => {
                return {
                    url: FEED_SERVICE_PROJECTS_API_URL + `projects/fragments/get?Page=${page}&PageSize=${pageSize}&ProjectNameFilter=${projectNameFilter}`,
                    method: 'GET'
                };
            }
        }),
    })
});

export const { 
    useCreateMutation,
    useGetQuery
 } = collationApi;