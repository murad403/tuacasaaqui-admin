import baseApi2 from "@/redux/api/baseApi2";

export type NewsCategory = {
    id: number;
    name: string;
    slug: string;
};

export type CreateNewsCategoryResponse = {
    message: string;
    data: NewsCategory;
};

const newsApi = baseApi2.injectEndpoints({
    endpoints: (builder) => ({
        getNews: builder.query({
            query: (params) => {
                return {
                    url: "/contents/news/",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["news"]
        }),
        createNews: builder.mutation({
            query: (data) => {
                console.log("api call", data)
                const formData = new FormData();
                Object.keys(data).forEach(key => {
                    if (data[key] !== null && data[key] !== undefined) {
                        if (data[key] instanceof File) {
                            formData.append(key, data[key]);
                        } else {
                            formData.append(key, String(data[key]));
                        }
                    }
                });
                return {
                    url: "/contents/news/create/",
                    method: "POST",
                    body: formData
                };
            },
            invalidatesTags: ["news"]
        }),
        getSingleNews: builder.query({
            query: (slug) => {
                return {
                    url: `/contents/news/${slug}/`,
                    method: "GET"
                };
            },
            providesTags: ["news"]
        }),
        deleteNews: builder.mutation({
            query: (slug) => {
                return {
                    url: `/contents/news/${slug}/delete/`,
                    method: "DELETE"
                };
            },
            invalidatesTags: ["news"]
        }),
        updateNews: builder.mutation({
            query: ({ slug, data }) => {
                const formData = new FormData();
                Object.keys(data).forEach(key => {
                    if (data[key] !== null && data[key] !== undefined) {
                        if (data[key] instanceof File) {
                            formData.append(key, data[key]);
                        } else {
                            formData.append(key, String(data[key]));
                        }
                    }
                });
                return {
                    url: `/contents/news/${slug}/update/`,
                    method: "PATCH",
                    body: formData
                };
            },
            invalidatesTags: ["news"]
        }),

        createNewsCategory: builder.mutation<CreateNewsCategoryResponse, { name: string }>({
            query: (data) => {
                return {
                    url: "/contents/news-categories/create/",
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["news"]
        }),
        getNewsCategories: builder.query<NewsCategory[], void>({
            query: () => {
                return {
                    url: "/contents/news-categories/",
                    method: "GET"
                };
            },
            providesTags: ["news"]
        }),
    })
});

export const { useGetNewsQuery, useCreateNewsMutation, useGetSingleNewsQuery, useDeleteNewsMutation, useUpdateNewsMutation, useGetNewsCategoriesQuery, useCreateNewsCategoryMutation } = newsApi;