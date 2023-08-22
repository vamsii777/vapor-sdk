import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosProgressEvent } from 'axios';
import { retry } from '@lifeomic/attempt';

/**
 * Options for configuring the VaporWrapper instance.
 */
interface VaporWrapperOptions {
    baseURL: string; // The base URL for the API requests
    maxRetries?: number; // The maximum number of retries for failed requests
    logger?: Console | null; // The logger instance to use for logging
    timeout?: number; // Request timeout in milliseconds
}

/**
 * Options for making API requests.
 */
interface RouteOptions {
    method: 'get' | 'post' | 'put' | 'delete'; // HTTP method
    route: string; // API route
    data?: any; // Request data
    token?: string; // Optional JWT token for authentication
    transformResponse?: (data: any) => any; // Optional response transformation function
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void; // Optional upload progress callback
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void; // Optional download progress callback
}

/**
 * Type definition for API response.
 */
interface ApiResponse<T> {
    data: T; // Response data
    status: number; // HTTP status code
    headers: Record<string, string | string[]>; // Response headers
}

/**
 * A wrapper class for making API requests with optional JWT authentication, response transformation, and enhanced logging.
 */
class VaporWrapper {
    private client: AxiosInstance;
    private maxRetries: number;
    private logger: Console;

    constructor(options: VaporWrapperOptions) {
        this.client = axios.create({
            baseURL: options.baseURL,
            timeout: options.timeout,
            withCredentials: true, // Enable cookies for session handling
        });
        this.maxRetries = options.maxRetries ?? 3;
        this.logger = options.logger ?? console;
    }

    /**
     * Session login method with dynamic route.
     * @param route The login endpoint
     * @param username The username for login
     * @param password The password for login
     * @returns The response data from the API
     */
    async login(route: string, username: string, password: string): Promise<ApiResponse<string>> {
        return this.route({
            method: 'post',
            route: route,
            data: { username, password },
        });
    }

    /**
     * Utility function to fetch data with dynamic route and optional JWT authentication.
     * @param route The endpoint to fetch data from
     * @param token Optional JWT token for authentication
     * @param transformResponse Optional response transformation function
     * @returns The response data from the API
     */
    async fetchData(route: string, token?: string, transformResponse?: (data: any) => any): Promise<ApiResponse<any>> {
        return this.route({
            method: 'get',
            route: route,
            token: token,
            transformResponse: transformResponse,
        });
    }

    /**
     * Generic route method with optional JWT authentication and response transformation.
     * @param options The options for making the API request
     * @returns The response data from the API
     */
    async route(options: RouteOptions): Promise<ApiResponse<any>> {
        try {
            const config: AxiosRequestConfig = {
                method: options.method,
                url: options.route,
                data: options.data,
                onUploadProgress: options.onUploadProgress,
                onDownloadProgress: options.onDownloadProgress,
                transformResponse: options.transformResponse,
            };

            // Add JWT token authentication if provided
            if (options.token) {
                config.headers = { Authorization: `Bearer ${options.token}` };
            }

            const response = await this.request(config);
            this.logger.log(`Request to ${options.route} succeeded`, {
                url: options.route,
                method: options.method,
                headers: response.headers,
                data: response.data,
                status: response.status,
                time: new Date().toISOString(),
            });
            return {
                data: response.data,
                status: response.status,
                headers: response.headers as Record<string, string | string[]>,
            };
        } catch (error) {
            this.logger.error(`Request to ${options.route} failed`, {
                url: options.route,
                method: options.method,
                error: error,
                time: new Date().toISOString(),
            });
            throw error;
        }
    }

    /**
     * Makes an API request using the specified configuration object with retry logic.
     * @param config The configuration object for the request
     * @returns The response data from the API
     */
    private async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
        return retry(async () => {
            const response = await this.client(config);
            return response;
        }, {
            maxAttempts: this.maxRetries,
            delay: 1000,
            factor: 2,
        });
    }
}

export default VaporWrapper;
