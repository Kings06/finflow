import { useMemo } from "react"
import { useTransactionsContext } from "../context/TransactionsContext"
import { generateFinancialInsights } from "../utils/insights"

function SpendingInsights() {
  const { transactions } = useTransactionsContext()

  const insights = useMemo(
    () => generateFinancialInsights(transactions),
    [transactions],
  )

  if (insights.length === 0) {
    return null
  }

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2
          className="text-xl font-semibold"
          style={{
            color: "var(--text-primary)",
          }}
        >
          Spending Insights
        </h2>

        <p
          className="mt-1 text-sm"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          A quick look at what your financial activity is telling you.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => {
          const styles = {
            positive: {
              container:
                "border-emerald-500/20 bg-emerald-500/5",
              badge:
                "bg-emerald-500/10 text-emerald-500",
              icon: "✓",
            },

            warning: {
              container:
                "border-red-500/20 bg-red-500/5",
              badge:
                "bg-red-500/10 text-red-500",
              icon: "!",
            },

            info: {
              container:
                "border-[var(--border)] bg-[var(--surface)]",
              badge:
                "bg-[var(--surface-hover)] text-[var(--text-secondary)]",
              icon: "i",
            },
          }

          const style = styles[insight.type]

          return (
            <article
              key={`${insight.title}-${index}`}
              className={`rounded-2xl border p-5 shadow-sm transition duration-200 hover:border-emerald-500/30 ${style.container}`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${style.badge}`}
                >
                  {style.icon}
                </span>

                <div className="min-w-0">
                  <h3
                    className="font-semibold"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {insight.title}
                  </h3>

                  <p
                    className="mt-2 text-sm leading-6"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {insight.message}
                  </p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default SpendingInsights