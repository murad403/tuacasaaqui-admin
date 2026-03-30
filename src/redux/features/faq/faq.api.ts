import baseApi2 from "@/redux/api/baseApi2";

const faqApi = baseApi2.injectEndpoints({
    endpoints: (builder) => ({
        getFaq: builder.query({
            query: () => {
                return {
                    url: "/contents/faqs/",
                    method: "GET"
                };
            },
            providesTags: ["faq"]
        }),
        getSingleFaq: builder.query({
            query: (id) => {
                return {
                    url: `/contents/faqs/${id}/`,
                    method: "GET"
                };
            },
            providesTags: ["faq"]
        }),
        createFaq: builder.mutation({
            query: (data) => {
                return {
                    url: "/contents/faqs/create/",
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["faq"]
        }),
        deleteFaq: builder.mutation({
            query: (id) => {
                return {
                    url: `/contents/faqs/${id}/delete/`,
                    method: "DELETE"
                };
            },
            invalidatesTags: ["faq"]
        }),
        updateFaq: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/contents/faqs/${id}/update/`,
                    method: "PUT",
                    body: data
                };
            },
            invalidatesTags: ["faq"]
        }),

    })
});


export const {useGetFaqQuery, useCreateFaqMutation, useDeleteFaqMutation, useUpdateFaqMutation, useGetSingleFaqQuery} = faqApi;