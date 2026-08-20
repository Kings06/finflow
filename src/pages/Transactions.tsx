import { useMemo, useState } from "react"
import { useTransactions } from "../hooks/useTransactions"
import TransactionItem from "../components/TransactionItem"

function Transactions() {
  const { transactions, loading, error } = useTransactions()

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const categories = [
    "all",
    ...new Set(
      transactions.map((transaction) => transaction.category),
    ),
  ]

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesType =
        typeFilter === "all" ||
        transaction.type === typeFilter

      const matchesCategory =
        categoryFilter === "all" ||
        transaction.category === categoryFilter

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory
      )
    })
  }, [transactions, search, typeFilter, categoryFilter])

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <p className="mt-4 text-slate-400">
          Loading transactions...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <p className="mt-4 text-red-400">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Transactions
      </h1>

      <p className="mt-2 text-slate-400">
        View and manage your financial transactions.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-500"
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
          className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
          className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        >
          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category === "all"
                ? "All Categories"
                : category}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))
        ) : (
          <div className="rounded-2xl bg-slate-900 p-10 text-center">
            <h2 className="text-lg font-semibold">
              No transactions found
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions