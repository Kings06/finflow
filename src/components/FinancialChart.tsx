import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { useTransactions } from "../hooks/useTransactions"

function FinancialChart() {
  const { transactions, loading, error } = useTransactions()

  const chartData = useMemo(() => {
    return transactions.slice(0, 7).map((transaction) => ({
      name: transaction.description.slice(0, 10),
      income:
        transaction.type === "income"
          ? transaction.amount
          : 0,
      expenses:
        transaction.type === "expense"
          ? transaction.amount
          : 0,
    }))
  }, [transactions])

  if (loading) {
    return (
      <section className="mt-8 h-[400px] animate-pulse rounded-2xl bg-slate-900" />
    )
  }

  if (error) {
    return (
      <section className="mt-8 rounded-2xl bg-red-950/40 p-6 text-red-400">
        {error}
      </section>
    )
  }

  return (
    <section className="mt-8 rounded-2xl bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Financial Overview
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Income and expenses from your recent transactions.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="income"
              name="Income"
              fill="#34d399"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#f87171"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default FinancialChart