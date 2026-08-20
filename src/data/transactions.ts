import type { Transaction } from "../types/transaction"

export const transactions: Transaction[] = [
  {
    id: 1,
    description: "Salary",
    amount: 450000,
    category: "Income",
    date: "2026-08-01",
    type: "income",
  },
  {
    id: 2,
    description: "Netflix Subscription",
    amount: 15000,
    category: "Entertainment",
    date: "2026-08-05",
    type: "expense",
  },
  {
    id: 3,
    description: "Grocery Shopping",
    amount: 42000,
    category: "Food",
    date: "2026-08-07",
    type: "expense",
  },
  {
    id: 4,
    description: "Freelance Project",
    amount: 120000,
    category: "Income",
    date: "2026-08-10",
    type: "income",
  },
  {
    id: 5,
    description: "Electricity Bill",
    amount: 28000,
    category: "Utilities",
    date: "2026-08-12",
    type: "expense",
  },
]