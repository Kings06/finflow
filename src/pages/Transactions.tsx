import TransactionList from "../components/TransactionList"

function Transactions() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Transactions
      </h1>

      <p className="mt-2 text-slate-400">
        View and manage your financial transactions.
      </p>

      <TransactionList />
    </div>
  )
}

export default Transactions