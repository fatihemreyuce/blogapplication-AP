import { supabase } from "@/lib/supabase";
import type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  ProfileListParams,
  ProfileListResult,
  ProfileStats,
} from "@/types/profile.types";

export const profileService = {
  async list(params: ProfileListParams = {}): Promise<ProfileListResult> {
    const { search, role, active, page = 1, pageSize = 9 } = params;

    let query = supabase.from("profiles").select("*", { count: "exact" });

    if (search?.trim()) {
      query = query.or(
        `username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }
    if (role && role !== "all") {
      query = query.eq("role", role);
    }
    if (active === "active") {
      query = query.eq("active", true);
    } else if (active === "inactive") {
      query = query.eq("active", false);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    const total = count ?? 0;
    return {
      data: (data ?? []) as Profile[],
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async stats(): Promise<ProfileStats> {
    const [totalRes, activeRes, adminRes] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("active", true),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin"),
    ]);
    return {
      total: totalRes.count ?? 0,
      active: activeRes.count ?? 0,
      admins: adminRes.count ?? 0,
    };
  },

  async getById(id: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data as Profile;
  },

  async create(profile: ProfileInsert): Promise<Profile> {
    const payload: ProfileInsert = {
      id: profile.id ?? crypto.randomUUID(),
      ...profile,
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === "23503" && error.message.includes("profiles_id_fkey")) {
        throw new Error(
          "Veritabani kurali nedeniyle profile id auth/users tablosunda olmalı. Coklu profil icin profiles_id_fkey constraint'ini kaldirman veya ayri bir user_id kolonu kullanman gerekiyor.",
        );
      }
      throw new Error(error.message);
    }
    return data as Profile;
  },

  async update(id: string, profile: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === "42501") {
        throw new Error("Guncelleme yetkiniz yok (RLS policy).");
      }
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Kayit guncellenemedi. RLS policy veya filtre nedeniyle 0 satir etkilendi.");
    }

    return data as Profile;
  },

  async remove(id: string): Promise<void> {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      if (error.code === "23503") {
        throw new Error("Bu profile bağlı kayıtlar var, önce ilişkili verileri silmelisiniz.");
      }
      if (error.code === "42501") {
        throw new Error("Silme yetkiniz yok (RLS policy).");
      }
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error("Profil silinemedi. Yetki (RLS) veya filtre nedeniyle kayıt etkilenmedi.");
    }
  },
};
