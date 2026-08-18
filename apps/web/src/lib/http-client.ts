import "server-only";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { AppError } from "./app-error";

const httpClient = axios.create({
  baseURL: process.env.API_URL,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error instanceof AxiosError) {
      if (error.response) {
        return Promise.resolve(error.response);
      }
    }

    return Promise.reject(error);
  },
);

const protectedHttpClient = httpClient.create({});

protectedHttpClient.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new AppError("UNAUTHENTICATED", "UNAUTHENTICATED");

    config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  (error) => {},
);

protectedHttpClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error instanceof AxiosError) {
      if (error.response) {
        return Promise.resolve(error.response);
      }
    }

    return Promise.reject(error);
  },
);

export { httpClient, protectedHttpClient };
