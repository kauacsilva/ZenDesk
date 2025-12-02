/**
 * Hook genérico para sincronizar estado com localStorage.
 *
 * Características
 * - Hidrata valor inicial ao montar.
 * - Escuta evento 'storage' para sincronizar entre abas.
 * - Aceita setState funcional (mesmo padrão do React).
 */
import * as React from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  /** Lê valor atual do localStorage (parse JSON) */
  const readValue = React.useCallback((): T => {
    if (typeof window === "undefined") return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = React.useState<T>(readValue)

  // Mantém estado em sincronia quando key ou initialValue mudam
  React.useEffect(() => {
    setStoredValue(readValue())
  }, [readValue])

  // Sincroniza estado entre abas via evento 'storage'
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const onStorage = (e: StorageEvent) => {
      if (e.storageArea !== window.localStorage) return
      if (e.key !== key) return
      try {
        // When the key is removed, e.newValue is null -> revert to initialValue
        const next = e.newValue === null ? initialValue : (JSON.parse(e.newValue) as T)
        setStoredValue(next)
      } catch {
        // If parsing fails, fall back to initialValue
        setStoredValue(initialValue)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [key, initialValue])

  /** Atualiza valor e persiste em localStorage (seguro contra erros) */
  const setValue = React.useCallback(
    (value: React.SetStateAction<T>) => {
      try {
        setStoredValue((prev) => {
          const valueToStore =
            typeof value === "function" ? (value as (val: T) => T)(prev) : value
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          }
          return valueToStore
        })
      } catch {
        // no-op
      }
    },
    [key]
  )

  return [storedValue, setValue] as const
}
