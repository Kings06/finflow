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
      <section
        className="mt-8 overflow-hidden rounded-2xl border"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="p-6">
          <div
            className="h-6 w-48 animate-pulse rounded-lg"
            style={{
              backgroundColor: "var(--surface-hover)",
            }}
          />

          <div
            className="mt-2 h-4 w-72 max-w-full animate-pulse rounded-lg"
            style={{
              backgroundColor: "var(--surface-hover)",
            }}
          />
        </div>

        <div
          className="h-80 animate-pulse"
          style={{
            backgroundColor:
              "rgba(148, 163, 184, 0.08)",
          }}
        />
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="mt-8 rounded-2xl border p-6"
        style={{
          borderColor: "rgba(239, 68, 68, 0.2)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
        }}
      >
        <p className="font-medium text-red-400">
          Unable to load financial chart
        </p>

        <p className="mt-2 text-sm text-red-400/80">
          {error}
        </p>
      </section>
    )
  }

  if (chartData.length === 0) {
    return (
      <section
        className="mt-8 rounded-2xl border p-6"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div>
          <p className="text-sm font-medium text-emerald-500">
            Financial trends
          </p>

          <h2
            className="mt-1 text-xl font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            Financial Overview
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Track your income and expenses over time.
          </p>
        </div>

        <div
          className="mt-8 flex min-h-70 flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center"
          style={{
            borderColor: "var(--border)",
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-xl text-emerald-500">
            ₦
          </div>

          <p
            className="mt-4 font-medium"
            style={{
              color: "var(--text-primary)",
            }}
          >
            No financial data yet
          </p>

          <p
            className="mt-2 max-w-sm text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Add some transactions to see your income
            and expenses visualized here.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="mt-8 overflow-hidden rounded-2xl border transition duration-200"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor =
          "var(--text-secondary)"
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor =
          "var(--border)"
      }}
    >
      <div
        className="border-b p-6"
        style={{
          borderColor: "var(--border)",
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-500">
              Financial trends
            </p>

            <h2
              className="mt-1 text-xl font-semibold tracking-tight"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Financial Overview
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Track your income and expenses over time.
            </p>
          </div>

          <p
            className="text-sm"
            style={{
              color: "var(--text-muted)",
            }}
          >
            {chartData.length}{" "}
            {chartData.length === 1
              ? "period"
              : "periods"}
          </p>
        </div>
      </div>

      <div className="h-80 w-full p-4 sm:h-90 sm:p-6">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
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
              tickFormatter={(value: string | number) => {
                const date = new Date(value)

                if (Number.isNaN(date.getTime())) {
                  return String(value)
                }

                return date.toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                )
              }}
              tick={{
                fontSize: 12,
                fill: "var(--text-muted)",
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(value: string | number) =>
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
  formatter={(value) => formatCurrency(Number(value))}
  labelFormatter={(value) => {
    const date = new Date(String(value))

    if (Number.isNaN(date.getTime())) {
      return String(value)
    }

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }}
  contentStyle={{
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    boxShadow:
      "0 10px 30px rgba(0, 0, 0, 0.15)",
  }}
  labelStyle={{
    color: "var(--text-secondary)",
    marginBottom: "6px",
  }}
  itemStyle={{
    color: "var(--text-primary)",
  }}
/>

            <Legend
              verticalAlign="bottom"
              height={32}
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                color: "var(--text-secondary)",
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