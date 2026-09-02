export type TransactionType =
  | "income"
  | "expense"

export type Transaction = {
  id: number
  description: string
  amount: number
  category: string
  date: string
  type: TransactionType
  accountId?: string
}