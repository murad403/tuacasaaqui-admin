"use client";
import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        {children}
      </div>
    </Provider>
  );
}
