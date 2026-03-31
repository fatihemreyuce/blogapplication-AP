export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
}

export interface User {
	id: number;
	username: string;
	email: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}
