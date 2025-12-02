/**
 * Utilitários de UI
 *
 * cn: combina classes condicionalmente (clsx) e resolve conflitos do Tailwind (twMerge).
 * Exemplo:
 *   cn("p-2", condition && "bg-red-500", "p-4") => "bg-red-500 p-4"
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina classes, removendo duplicadas e respeitando a prioridade de Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
