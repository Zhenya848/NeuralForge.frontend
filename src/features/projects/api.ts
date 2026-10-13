import { baseApi, FEED_SERVICE_PROJECTS_API_URL } from "@/app/baseApi";
import type { Project } from "@/entities/projects/Project";
import type { Envelope } from "@/shared/api/Envelope";
import type { PageList } from "@/shared/api/PageList";
import type { UpdateProjectDto } from "./models/UpdateProjectDto";

export const projectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createProject: builder.mutation<Envelope<string>, { name: string, description: string, emojiId: number, colorId: number }>({
            query: ({ name, description, emojiId, colorId }) => {
                return {
                    url: FEED_SERVICE_PROJECTS_API_URL,
                    method: 'POST',
                    body: { name, description, emojiId, colorId },
                };
            },
            invalidatesTags: ["Chats"],
        }),
        changeProjects: builder.mutation<Envelope<null>, { projects: UpdateProjectDto[] }>({
            query: ({ projects }) => {
                return {
                    url: FEED_SERVICE_PROJECTS_API_URL,
                    method: 'PUT',
                    body: { projects },
                };
            }
        }),
        getWithChats: builder.query<Envelope<PageList<Project>>, { page: number, pageSize: number }>({
            query: ({ page, pageSize }) => {
                return {
                    url: FEED_SERVICE_PROJECTS_API_URL + `chats?Page=${page}&PageSize=${pageSize}`,
                    method: 'GET'
                };
            },
            providesTags: ["Chats"],
        }),
        getWithFragments: builder.query<Envelope<PageList<Project>>, { page: number, pageSize: number, nameFilter?: string }>({
            query: ({ page, pageSize, nameFilter }) => {
                return {
                    url: FEED_SERVICE_PROJECTS_API_URL + `fragments?Page=${page}&PageSize=${pageSize}&NameFilter=${nameFilter}`,
                    method: 'GET'
                };
            }
        }),
    })
});

export const { 
    useCreateProjectMutation,
    useChangeProjectsMutation,
    useGetWithFragmentsQuery,
    useGetWithChatsQuery
 } = projectApi;