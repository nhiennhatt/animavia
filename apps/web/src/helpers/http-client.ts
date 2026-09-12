"server-only";

import axios, { AxiosResponse, create } from "axios";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { JOSEError } from "jose/errors";
import { HttpClientError } from "../errors/HttpClientError";

const responseHandler = (res: AxiosResponse) => {
  return Promise.resolve(res.data);
};

const responseErrorHandler = (error: any) => {
  let code = "INTERNAL_ERROR";
  let errorData: unknown = "INTERNAL_ERROR";
  if (axios.isAxiosError(error)) {
    console.log(error.response)
    code = error.response?.data?.code || code;
    errorData = error.response?.data?.error ?? errorData;
  } else if (error instanceof Error) {
    errorData = error.message;
  }

  return Promise.resolve({
    success: false,
    error: errorData,
    code,
  });
};

const httpClient = create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

httpClient.interceptors.response.use(responseHandler, responseErrorHandler);

const protectedHttpClient = create({
  ...httpClient.defaults,
});

protectedHttpClient.interceptors.request.use(
  async (config) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("accessToken");

      if (!token || !token.value.trim())
        throw new HttpClientError("UNAUTHORIZED");

      const parsedToken = await decodeJwt(token.value);

      if (
        parsedToken.exp &&
        parsedToken.exp - Math.floor(new Date().getTime() / 1000) < 4 * 60
      ) {
        throw new HttpClientError("TOKEN_EXPIRED_SOON");
      }

      config.headers.Authorization = `Bearer ${token.value}`;
    } catch (error) {
      if (error instanceof JOSEError) {
        config.adapter = (config) => {
          return Promise.resolve({
            status: 200,
            headers: config.headers,
            config: config,
            statusText: "OK",
            data: {
              success: false,
              code: "UNAUTHORIZED",
              error: "UNAUTHORIZED",
            },
          });
        };
      }

      if (error instanceof HttpClientError) {
        config.adapter = (config) => {
          return Promise.resolve({
            status: 200,
            headers: config.headers,
            config: config,
            statusText: "OK",
            data: {
              success: false,
              code: error.message,
              error: error.message,
            },
          });
        };
      }
    }

    return config;
  },
  (error) => {
    return Promise.resolve({
      success: false,
      code: "INTERNAL_ERROR",
      error: "INTERNAL_ERROR",
    });
  },
);

protectedHttpClient.interceptors.response.use(
  responseHandler,
  responseErrorHandler,
);

export { httpClient, protectedHttpClient };
