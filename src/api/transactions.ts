import apiClient from "./client"
import type { ApiPost } from "../types/api"

export async function getTransactions(): Promise<ApiPost[]> {
  const response = await apiClient.get<ApiPost[]>("/posts")

  return response.data
}