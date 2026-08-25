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
      <section className="mt-8 h-[400px] animate-pulse rounded-2xl bg-[var(--surface)]" />
    )
  }

  if (error) {
    return (
      <section className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-500">
        {error}
      </section>
    )
  }

  return (
    <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition duration-200 hover:bg-[var(--surface-hover)]">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          Financial Overview
        </h2>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
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
              stroke="var(--border)"
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
              tick={{
                fontSize: 12,
                fill: "var(--text-muted)",
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                formatCurrency(Number(value))
              }
              tick={{
                fontSize: 12,
                fill: "var(--text-muted)",
              }}
              tickLine={false}
              axisLine={false}
              width={70}
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value))
              }
              contentStyle={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--text-primary)",
              }}
              labelStyle={{
                color: "var(--text-secondary)",
              }}
              itemStyle={{
                color: "var(--text-primary)",
              }}
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