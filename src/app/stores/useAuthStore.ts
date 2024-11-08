"use client";

import { api } from "@/services/apiClient";
import {
  SignInCredentials,
  SignInResponse,
  SignUpCredentials,
  SignUpResponse,
  User,
} from "@/types";
import { destroyCookie, setCookie } from "nookies";
import { create } from "zustand";

// Interface base da store sem navegação
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isVisible: boolean; // Novo estado adicionado
  setIsVisible: (value: boolean) => void; // Nova função adicionada
  toggleRegister: boolean; // Novo estado adicionado
  setToggleRegister: (value: boolean) => void; // Função para alterar o estado
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => void;
}

// Store base sem navegação
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  toggleRegister: false, // Valor inicial do toggleRegister
  setToggleRegister: (value: boolean) => set({ toggleRegister: value }), // Função para alterar o estado
  signIn: async ({ email, password }: SignInCredentials) => {
    console.log("Fazendo login...");
    try {
      const response = await api.post<SignInResponse>("/session", {
        email,
        password,
      });

      const { address, id, name, token, subscription } = response.data;

      setCookie(undefined, "@barber.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      set({
        user: { id, name, email, address, subscriptions: subscription },
        isAuthenticated: true,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error(error, "Erro ao fazer login");
    }
  },
  signOut: () => {
    destroyCookie(undefined, "@barber.token");
    set({ user: null, isAuthenticated: false });
  },
  signUp: async ({ name, email, password }: SignUpCredentials) => {
    try {
      const response = await api.post<SignUpResponse>("/users", {
        name,
        email,
        password,
      });

      console.log(response.data, "Cadastro realizado com sucesso");
    } catch (error) {
      console.error(error, "Erro ao fazer cadastro");
    }
  },
  isVisible: false, // Valor inicial do isVisible
  setIsVisible: (value: boolean) => set({ isVisible: value }), // Função para alterar o estado
}));
