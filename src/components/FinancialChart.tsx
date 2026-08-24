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

import { useTransactionsContext } from "../context/TransactionsContext"
import { buildFinancialChartData } from "../utils/chart"
import { formatCurrency } from "../utils/currency"

function FinancialChart() {
  const { transactions, loading, error } =
    useTransactionsContext()

  const chartData = useMemo(
    () => buildFinancialChartData(transactions),
    [transactions],
  )

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
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 transition duration-200 hover:border-slate-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Financial Overview
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Income and expenses from your recent transactions.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 8,
              right: 8,
              left: 0,
              bottom: 8,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                formatCurrency(Number(value))
              }
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={70}
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value))
              }
            />

            <Bar
              dataKey="income"
              name="Income"
              fill="#34d399"
              radius={[6, 6, 0, 0]}
              maxBarSize={42}
            />

            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#f87171"
              radius={[6, 6, 0, 0]}
              maxBarSize={42}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default FinancialChart