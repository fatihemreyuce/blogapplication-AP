import { supabase } from "@/lib/supabase";
import type { LoginRequest, LoginResponse } from "@/types/auth.types";

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: request.email,
    password: request.password,
  });

  if (error) throw new Error(error.message);

  return {
    accessToken: data.session?.access_token ?? "",
    refreshToken: data.session?.refresh_token ?? "",
  };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
