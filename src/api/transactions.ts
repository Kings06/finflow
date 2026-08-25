import apiClient from "./client"
import { transformPostToTransaction } from "./transformers"
import type { ApiPost } from "../types/api"
import type { Transaction } from "../types/transaction"

export async function getTransactions(): Promise<Transaction[]> {
  const response = await apiClient.get<ApiPost[]>("/posts")

  return response.data.map(transformPostToTransaction)
}

export async function createTransaction(
  transaction: Omit<Transaction, "id">,
): Promise<Transaction> {
  await apiClient.post("/posts", {
    title: transaction.description,
    body: JSON.stringify({
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
    }),
    userId: 1,
  })

  return {
    id: Date.now(),
    ...transaction,
  }
}

export async function updateTransaction(
  id: number,
  transaction: Omit<Transaction, "id">,
): Promise<Transaction> {
  if (id <= 100) {
    await apiClient.put(`/posts/${id}`, {
      title: transaction.description,
      body: JSON.stringify({
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        type: transaction.type,
      }),
      userId: 1,
    })
  }

  return {
    id,
    ...transaction,
  }
}

export async function deleteTransaction(
  id: number,
): Promise<void> {
  await apiClient.delete(`/posts/${id}`)
}