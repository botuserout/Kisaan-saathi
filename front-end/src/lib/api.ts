
import { auth } from '@/lib/firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

if (!API_BASE_URL) {
    console.error("API Base URL is not defined. Please check your .env.local");
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface APIOptions extends RequestInit {
    data?: any;
    token?: string;
}

export class APIError extends Error {
    constructor(public status: number, public message: string, public data?: any) {
        super(message);
        this.name = 'APIError';
    }
}

async function request<T>(endpoint: string, method: RequestMethod, options: APIOptions = {}): Promise<T> {
    const { data, token, headers, ...customConfig } = options;

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        } as HeadersInit,
        ...customConfig,
    };

    // Auto-inject Auth Token if available and not explicitly provided
    if (!token && auth.currentUser) {
        const freshToken = await auth.currentUser.getIdToken();
        (config.headers as any)['Authorization'] = `Bearer ${freshToken}`;
    } else if (token) {
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(response.status, errorData.detail || 'Something went wrong', errorData);
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, options?: APIOptions) => request<T>(endpoint, 'GET', options),
    post: <T>(endpoint: string, data: any, options?: APIOptions) => request<T>(endpoint, 'POST', { ...options, data }),
    put: <T>(endpoint: string, data: any, options?: APIOptions) => request<T>(endpoint, 'PUT', { ...options, data }),
    del: <T>(endpoint: string, options?: APIOptions) => request<T>(endpoint, 'DELETE', options),
};
