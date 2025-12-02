/**
 * Tipos e contexto de autenticação.
 *
 * O contexto é preenchido pelo AuthProvider (see use-auth.tsx) e acessado via useAuth (use-auth-hook.ts).
 */
import { createContext } from "react";

/** Representa o usuário autenticado que recebemos do backend */
export type AuthUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userType: string | number;
  lastLoginAt?: string | null;
  name?: string;
};

/** Contrato exposto pelo contexto de autenticação */
export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

/** Contexto React para autenticação (use via useAuth) */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
