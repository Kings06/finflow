import type { ApiPost } from "../types/api"
import type { Transaction } from "../types/transaction"

const categories = [
  "Salary",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Others",
]

export function transformPostToTransaction(
  post: ApiPost,
): Transaction {
  const isIncome = post.id % 4 === 0

  const category = isIncome
    ? "Salary"
    : categories[post.id % categories.length]

  const amount = isIncome
    ? 150000 + post.id * 5000
    : 5000 + post.id * 2500

  const date = new Date(
    2026,
    7,
    (post.id % 20) + 1,
  )
    .toISOString()
    .split("T")[0]

  return {
    id: post.id,
    description: post.title,
    amount,
    category,
    date,
    type: isIncome ? "income" : "expense",
  }
}