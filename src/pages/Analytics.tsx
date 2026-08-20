import FinancialChart from "../components/FinancialChart"

function Analytics() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Analytics
      </h1>

      <p className="mt-2 text-slate-400">
        Understand your financial performance.
      </p>

      <FinancialChart />
    </div>
  )
}

export default Analytics