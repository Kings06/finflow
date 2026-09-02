import type { Currency } from "../context/PreferencesContext"

export type AccountType =
  | "cash"
  | "checking"
  | "savings"
  | "credit"
  | "investment"

export type Account = {
  id: string
  name: string
  type: AccountType
  balance: number
  currency: Currency
  createdAt: string
}