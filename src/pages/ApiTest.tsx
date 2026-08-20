import { useEffect, useState } from "react"
import { getPosts } from "../api/posts"
import type { ApiPost } from "../types/api"

function ApiTest() {
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts()
        setPosts(data.slice(0, 5))
      } catch {
        setError("Failed to load API data.")
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) {
    return <p className="text-slate-400">Loading API data...</p>
  }

  if (error) {
    return <p className="text-red-400">{error}</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        API Test
      </h1>

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl bg-slate-900 p-5"
          >
            <h2 className="font-semibold">
              {post.title}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {post.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApiTest