import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { LoginContext } from "@/contexts/login-context";
import { setAccessToken } from "@/utils/token-manager";
import { login, logout } from "@/services/auth-services";
import type { LoginRequest } from "@/types/auth.types";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface LoginContextType {
	isLoggedIn: boolean;
	login: (request: LoginRequest) => Promise<void>;
	logout: () => Promise<void>;
	isActionable: boolean;
	isLoading: boolean;
}

export const LoginProvider = ({ children }: { children: ReactNode }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isStarted, setIsStarted] = useState(false);
	const queryClient = useQueryClient();

	const effectRan = useRef(false);

	const isActionable = isStarted && !isLoading;

	useEffect(() => {
		setIsStarted(true);
		if (effectRan.current) return;
		effectRan.current = true;

		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session) {
				setAccessToken(session.access_token);
				setIsLoggedIn(true);
			}
			setIsLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				setAccessToken(session.access_token);
				setIsLoggedIn(true);
			} else {
				setAccessToken(null);
				setIsLoggedIn(false);
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			await logout();
			setAccessToken(null);
			setIsLoggedIn(false);
			queryClient.removeQueries();
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogin = async (request: LoginRequest) => {
		setIsLoading(true);
		try {
			const response = await login(request);
			if (response.accessToken) {
				setAccessToken(response.accessToken);
				setIsLoggedIn(true);
				await queryClient.invalidateQueries({ queryKey: ["me"] });
			} else {
				setAccessToken(null);
				setIsLoggedIn(false);
			}
		} catch (error) {
			setAccessToken(null);
			setIsLoggedIn(false);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<LoginContext.Provider
			value={{
				isLoggedIn,
				login: handleLogin,
				logout: handleLogout,
				isActionable,
				isLoading,
			}}
		>
			{children}
		</LoginContext.Provider>
	);
};
