import baseApi2 from "@/redux/api/baseApi2";

export interface GuideItem {
    id: number;
    category: number;
    category_title: string;
    title: string;
    slug: string;
    content: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface GuideCategory {
    id: number;
    title: string;
    slug: string;
    order: number;
}

export interface GuideCategoryWithGuides extends GuideCategory {
    guides: GuideItem[];
}

export interface CreateGuideCategoryBody {
    title: string;
    order: number;
}

export interface CreateGuideBody {
    category: number;
    title: string;
    content: string;
    is_published: boolean;
}

export interface UpdateGuideBody {
    category: number;
    title: string;
    content: string;
    is_published: boolean;
}

const guideApi = baseApi2.injectEndpoints({
    endpoints: (builder) => ({
        getGuideCategories: builder.query<GuideCategory[], void>({
            query: () => {
                return {
                    url: "/contents/guide-categories/",
                    method: "GET",
                };
            },
            providesTags: ["guide"]
        }),
        getSingleGuideCategories: builder.query<GuideCategoryWithGuides, string>({
            query: (slug) => {
                return {
                    url: `/contents/guide-categories/${slug}/`,
                    method: "GET",
                };
            },
            providesTags: ["guide"]
        }),
        createGuideCategories: builder.mutation<GuideCategory, CreateGuideCategoryBody>({
            query: (data) => {
                return {
                    url: "/contents/guide-categories/create/",
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["guide"]
        }),
        deleteGuideCategories: builder.mutation<void, string>({
            query: (slug) => {
                return {
                    url: `/contents/guide-categories/${slug}/delete/`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["guide"]
        }),
        updateGuideCategories: builder.mutation<GuideCategory, { slug: string; data: CreateGuideCategoryBody }>({
            query: ({ slug, data }) => {
                return {
                    url: `/contents/guide-categories/${slug}/update/`,
                    method: "PUT",
                    body: data
                };
            },
            invalidatesTags: ["guide"]
        }),

        getGuides: builder.query<GuideCategoryWithGuides[], void>({
            query: () => {
                return {
                    url: "/contents/guides/",
                    method: "GET",
                };
            },
            providesTags: ["guide"]
        }),
        getSingleGuides: builder.query<GuideItem, string>({
            query: (slug) => {
                return {
                    url: `/contents/guides/${slug}/`,
                    method: "GET",
                };
            },
            providesTags: ["guide"]
        }),
        createGuides: builder.mutation<GuideItem, CreateGuideBody>({
            query: (data) => {
                return {
                    url: "/contents/guides/create/",
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["guide"]
        }),
        deleteGuides: builder.mutation<void, string>({
            query: (slug) => {
                return {
                    url: `/contents/guides/${slug}/delete/`,
                    method: "DELETE"
                };
            },
            invalidatesTags: ["guide"]
        }),
        updateGuides: builder.mutation<GuideItem, { slug: string; data: UpdateGuideBody }>({
            query: ({ slug, data }) => {
                return {
                    url: `/contents/guides/${slug}/update/`,
                    method: "PUT",
                    body: data
                };
            },
            invalidatesTags: ["guide"]
        }),
    })
});


export const {useCreateGuideCategoriesMutation, useDeleteGuideCategoriesMutation, useUpdateGuideCategoriesMutation, useCreateGuidesMutation, useDeleteGuidesMutation, useUpdateGuidesMutation, useGetGuideCategoriesQuery, useGetSingleGuideCategoriesQuery, useGetGuidesQuery, useGetSingleGuidesQuery} = guideApi;