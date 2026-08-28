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
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Spending Insights
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A quick look at what your financial activity is telling you.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => {
          const styles = {
            positive: {
              container:
                "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20",
              badge:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400",
              icon: "✓",
            },
            warning: {
              container:
                "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20",
              badge:
                "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400",
              icon: "!",
            },
            info: {
              container:
                "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
              badge:
                "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
              icon: "i",
            },
          }

          const style = styles[insight.type]

          return (
            <article
              key={`${insight.title}-${index}`}
              className={`rounded-2xl border p-5 shadow-sm transition-colors duration-200 ${style.container}`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${style.badge}`}
                >
                  {style.icon}
                </span>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {insight.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
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