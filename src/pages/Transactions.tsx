import { useMemo, useState } from "react"
import { useTransactionsContext } from "../context/TransactionsContext"
import TransactionItem from "../components/TransactionItem"
import {
  sortTransactions,
  type TransactionSort,
} from "../utils/transactions"

function Transactions() {
  const { transactions, loading, error } = useTransactionsContext()

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sort, setSort] = useState<TransactionSort>("newest")

  const categories = [
    "all",
    ...new Set(
      transactions.map((transaction) => transaction.category),
    ),
  ]

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
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

    return sortTransactions(filtered, sort)
  }, [
    transactions,
    search,
    typeFilter,
    categoryFilter,
    sort,
  ])

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <p className="mt-2 text-slate-400">
          Loading your financial activity...
        </p>

        <div className="mt-8 space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl bg-slate-900"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/30 p-6">
          <p className="font-medium text-red-400">
            Unable to load transactions
          </p>

          <p className="mt-2 text-sm text-red-400/80">
            {error}
          </p>
        </div>
      </div>
    )
  }

  const hasActiveFilters =
    search !== "" ||
    typeFilter !== "all" ||
    categoryFilter !== "all"

  const clearFilters = () => {
    setSearch("")
    setTypeFilter("all")
    setCategoryFilter("all")
  }

  return (
    <div>
      <header>
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <p className="mt-2 text-slate-400">
          View and manage your financial transactions.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-white">
            Find a transaction
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search, filter, or sort your financial activity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
          />

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as TransactionSort)
            }
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest amount</option>
            <option value="lowest">Lowest amount</option>
          </select>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
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
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
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
      </section>

      <div className="mt-6 flex min-h-6 items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-medium text-slate-200">
            {filteredTransactions.length}
          </span>{" "}
          {filteredTransactions.length === 1
            ? "transaction"
            : "transactions"}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-lg font-semibold">
              No transactions found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              We couldn't find any transactions matching
              your current search or filters.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions