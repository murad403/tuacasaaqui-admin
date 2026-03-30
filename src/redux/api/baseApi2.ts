import { getCurrentUser } from "@/utils/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery2 = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL_2,
  prepareHeaders: async (headers) => {
    const { accessToken } = await getCurrentUser();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseApi2 = createApi({
  reducerPath: "baseApi2",
  baseQuery: baseQuery2,
  tagTypes: ["faq"],
  endpoints: () => ({}),
});

export default baseApi2;
