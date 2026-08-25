import { Link } from "react-router-dom"
import type { Transaction } from "../types/transaction"
import { formatCurrency } from "../utils/currency"

type TransactionItemProps = {
  transaction: Transaction
}

function TransactionItem({
  transaction,
}: TransactionItemProps) {
  const isIncome = transaction.type === "income"

  return (
    <Link
      to={`/transactions/${transaction.id}`}
      className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
    >
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--surface-hover)]">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[var(--text-primary)]">
            {transaction.description}
          </h3>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {transaction.category} ·{" "}
            {new Date(transaction.date).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            )}
          </p>
        </div>

        <p
          className={`shrink-0 font-semibold ${
            isIncome
              ? "text-emerald-500"
              : "text-red-500"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </Link>
  )
}

export default TransactionItem