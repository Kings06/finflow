import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { chartData } from "../data/chartData"

function FinancialChart() {
  return (
    <section className="mt-8 rounded-2xl bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Financial Overview
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Income vs expenses over the last 7 months
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="income"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#f87171"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default FinancialChart