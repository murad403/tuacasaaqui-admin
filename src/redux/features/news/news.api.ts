import baseApi2 from "@/redux/api/baseApi2";

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
    })
});

export const { useGetNewsQuery, useCreateNewsMutation, useGetSingleNewsQuery, useDeleteNewsMutation, useUpdateNewsMutation } = newsApi;