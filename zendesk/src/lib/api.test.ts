import { describe, it, expect, beforeEach } from "vitest";
import { AxiosError, AxiosHeaders, type AxiosResponse, type AxiosInterceptorManager, type InternalAxiosRequestConfig } from "axios";
import { api, getToken, setToken, TOKEN_STORAGE_KEY } from "./api";

type InterceptorHandler<T> = {
    fulfilled?: (value: T) => T | Promise<T>;
    rejected?: (error: unknown) => unknown;
};

type InterceptorManagerWithHandlers<T> = AxiosInterceptorManager<T> & {
    handlers: InterceptorHandler<T>[];
};

describe("api utilities", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("persists and retrieves JWT tokens", () => {
        expect(getToken()).toBeNull();
        setToken("abc123");
        expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("abc123");
        expect(getToken()).toBe("abc123");
        setToken(null);
        expect(getToken()).toBeNull();
    });

    it("injects Authorization header when token exists", async () => {
        setToken("with-header");
        const requestInterceptors = (api.interceptors.request as unknown as InterceptorManagerWithHandlers<InternalAxiosRequestConfig>).handlers;
        const handler = requestInterceptors[0]?.fulfilled;
        expect(handler).toBeTruthy();

        const config = await handler!({ headers: new AxiosHeaders() } as InternalAxiosRequestConfig);
        expect(config.headers?.get("Authorization")).toBe("Bearer with-header");
    });

    it("clears token on 401 responses", async () => {
        setToken("expired");
        const responseInterceptors = (api.interceptors.response as unknown as InterceptorManagerWithHandlers<AxiosResponse>).handlers;
        const handler = responseInterceptors[0]?.rejected;
        expect(handler).toBeTruthy();

        const response: AxiosResponse = {
            status: 401,
            statusText: "Unauthorized",
            headers: new AxiosHeaders(),
            config: {} as InternalAxiosRequestConfig,
            data: {},
        };
        const unauthenticatedError = new AxiosError(
            "Unauthorized",
            undefined,
            {} as InternalAxiosRequestConfig,
            undefined,
            response
        );

        await expect(handler!(unauthenticatedError)).rejects.toBeDefined();
        expect(getToken()).toBeNull();
    });
});
