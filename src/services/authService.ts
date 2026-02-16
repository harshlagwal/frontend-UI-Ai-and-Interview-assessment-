export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

const API_URL = '/api/auth';

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('jwt', data.token);
        return data;
    },

    async signup(userData: {
        username: string;
        email: string;
        password: string;
        full_name: string;
    }): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }

        const data = await response.json();
        localStorage.setItem('jwt', data.token);
        return data;
    },

    async getMe(): Promise<User> {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('No session');

        const response = await fetch(`${API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            localStorage.removeItem('jwt');
            throw new Error('Session expired');
        }

        return response.json();
    },

    logout() {
        localStorage.removeItem('jwt');
    },

    getToken() {
        return localStorage.getItem('jwt');
    }
};
