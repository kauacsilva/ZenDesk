import { createContext } from 'react'

export type AvailableLocale = 'pt' | 'en'

export type I18nContextType = {
    locale: AvailableLocale
    t: (key: string, params?: Record<string, string | number>) => string
    setLocale: (locale: AvailableLocale) => void
}

export const I18nContext = createContext<I18nContextType | null>(null)
