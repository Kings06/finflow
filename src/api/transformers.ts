import type { ApiPost } from "../types/api"
import type { Transaction } from "../types/transaction"

export function transformPostToTransaction(
  post: ApiPost,
): Transaction {
  const isIncome = post.id % 2 === 0

  return {
    id: post.id,
    description: post.title,
    amount: post.id * 12500,
    category: isIncome ? "Income" : "General",
    date: "2026-08-20",
    type: isIncome ? "income" : "expense",
  }
}