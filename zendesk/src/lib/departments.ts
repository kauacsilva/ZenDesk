/**
 * Acesso à API de departamentos.
 */
import { api } from "./api";

/** Tipo básico de departamento */
export type Department = { id: number; name: string };

/** Lista departamentos disponíveis para roteamento de tickets */
export async function listDepartments(): Promise<Department[]> {
    const res = await api.get<{ message?: string; data: Department[] }>("/departments");
    return res.data.data;
}
