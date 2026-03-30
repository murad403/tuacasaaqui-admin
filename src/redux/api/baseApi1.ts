import { getCurrentUser } from "@/utils/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL_1,
  prepareHeaders: async (headers) => {
    const { accessToken } = await getCurrentUser();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseApi1 = createApi({
  reducerPath: "baseApi1",
  baseQuery,
  tagTypes: ["auth", "Profile", "user"],
  endpoints: () => ({}),
});

export default baseApi1;
