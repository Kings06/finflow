import apiClient from "./client"
import { transformPostToTransaction } from "./transformers"
import type { ApiPost } from "../types/api"
import type { Transaction } from "../types/transaction"

export async function getTransactions(): Promise<Transaction[]> {
  const response = await apiClient.get<ApiPost[]>("/posts")

  return response.data.map(transformPostToTransaction)
}