import { configureStore } from "@reduxjs/toolkit";
import baseApi2 from "./api/baseApi2";
import baseApi1 from "./api/baseApi1";

const store = configureStore({
  reducer: {
    [baseApi1.reducerPath]: baseApi1.reducer,
    [baseApi2.reducerPath]: baseApi2.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi1.middleware, baseApi2.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
