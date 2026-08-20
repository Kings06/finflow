import { transactions } from "../data/transactions"
import TransactionItem from "./TransactionItem"

function TransactionList() {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">
        Recent Transactions
      </h2>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>
    </section>
  )
}

export default TransactionList