import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { retry } from '@lifeomic/attempt';

/**
 * Options for configuring the VaporWrapper instance.
 */
interface VaporWrapperOptions {
    /**
     * The base URL for the API requests.
     */
    baseURL: string;
    /**
     * The maximum number of retries for failed requests.
     * @default 3
     */
    maxRetries?: number;
    /**
     * The logger instance to use for logging.
     * @default console
     */
    logger?: Console | null;
    /**
     * The authorization token to use for API requests.
     * @default ''
     */
    token?: string;
}

/**
 * A wrapper class for making API requests to the Vapor API.
 */
class VaporWrapper {
    private client: AxiosInstance;
    private maxRetries: number;
    private logger: Console;

    /**
     * Creates a new instance of the VaporWrapper class.
     * @param options The options for configuring the instance.
     */
    constructor({ baseURL, maxRetries = 3, logger = null, token = '' }: VaporWrapperOptions) {
        this.client = axios.create({
            baseURL: baseURL,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        this.maxRetries = maxRetries;
        this.logger = logger ?? console;
    }

    /**
     * Makes an API request to the specified route using the specified method and data.
     * @param method The HTTP method to use for the request.
     * @param route The route to make the request to.
     * @param data The data to send with the request.
     * @returns The response data from the API.
     * @throws An error if the request fails after the maximum number of retries.
     */
    async route(method: 'get' | 'post' | 'put' | 'delete', route: string, data = {}): Promise<any> {
        try {
            const response = await this.request({
                method: method,
                url: route,
                data: data,
            });
            this.logger.log(`Request to ${route} succeeded`);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Request to ${route} failed: ${error.message}`);
            } else {
                this.logger.error(`Request to ${route} failed: ${error}`);
            }
            throw error;
        }
    }    

    /**
     * Makes an API request using the specified configuration object.
     * @param config The configuration object for the request.
     * @returns The response data from the API.
     * @throws An error if the request fails after the maximum number of retries.
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
