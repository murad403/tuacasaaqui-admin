import baseApi from "@/redux/api/baseApi";


const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (data) =>{
                return {
                    url: "/sign-in",
                    method: "POST",
                    body: data
                }
            }
        })
    })
})


export const { useSignInMutation } = authApi;