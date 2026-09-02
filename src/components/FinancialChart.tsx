import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { Transaction } from "../types/transaction"
import { buildFinancialChartData } from "../utils/chart"
import { formatCurrency } from "../utils/currency"

type FinancialChartProps = {
  transactions: Transaction[]
}

function FinancialChart({
  transactions,
}: FinancialChartProps) {
  const chartData = useMemo(
    () =>
      buildFinancialChartData(transactions),
    [transactions],
  )

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="font-semibold text-[var(--text-primary)]">
          Financial Trends
        </h2>

        <div className="flex min-h-[320px] items-center justify-center">
          <p className="text-sm text-[var(--text-muted)]">
            No financial data available for this
            period.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-[var(--text-primary)]">
            Financial Trends
          </h2>

          <p className="text-sm text-[var(--text-secondary)]">
            Income and expenses over time
          </p>
        </div>

        <span className="text-xs text-[var(--text-muted)]">
          {chartData.length}{" "}
          {chartData.length === 1
            ? "period"
            : "periods"}
        </span>
      </div>

      <div className="mt-6 h-[360px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
            />

            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString(
                  "en-NG",
                  {
                    day: "numeric",
                    month: "short",
                  },
                )
              }
              tick={{
                fill: "var(--text-muted)",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                formatCurrency(value)
              }
              tick={{
                fill: "var(--text-muted)",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
              width={80}
            />

            <Tooltip
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                name === "income"
                  ? "Income"
                  : "Expenses",
              ]}
              labelFormatter={(date) =>
                new Date(
                  String(date),
                ).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              }
              contentStyle={{
                borderRadius: "12px",
                border:
                  "1px solid var(--border)",
                background:
                  "var(--surface)",
                color:
                  "var(--text-primary)",
              }}
            />

            <Legend
              formatter={(value) =>
                value === "income"
                  ? "Income"
                  : "Expenses"
              }
            />

            <Bar
              dataKey="income"
              name="income"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />

            <Bar
              dataKey="expenses"
              name="expenses"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default FinancialChart