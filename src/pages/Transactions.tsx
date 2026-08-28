import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useTransactionsContext } from "../context/TransactionsContext"
import TransactionItem from "../components/TransactionItem"
import {
  calculateTransactionTotals,
  sortTransactions,
  type TransactionSort,
} from "../utils/transactions"
import { formatCurrency } from "../utils/currency"

function Transactions() {
  const { transactions, loading, error } =
    useTransactionsContext()

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sort, setSort] =
    useState<TransactionSort>("newest")

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(
        transactions.map(
          (transaction) => transaction.category,
        ),
      ),
    ]
  }, [transactions])

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

  
  const transactionTotals = useMemo(
  () => calculateTransactionTotals(filteredTransactions),
  [filteredTransactions],
)

  const netAmount =
    transactionTotals.income -
    transactionTotals.expenses

  const hasActiveFilters =
    search !== "" ||
    typeFilter !== "all" ||
    categoryFilter !== "all"

  const clearFilters = () => {
    setSearch("")
    setTypeFilter("all")
    setCategoryFilter("all")
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Transactions
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Loading your financial activity...
        </p>

        <div className="mt-8 space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Transactions
        </h1>

        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
          <p className="font-medium text-red-600 dark:text-red-400">
            Unable to load transactions
          </p>

          <p className="mt-2 text-sm text-red-500 dark:text-red-400/80">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Transactions
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            View and manage your financial transactions.
          </p>
        </div>

        <Link
          to="/transactions/new"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          + Add Transaction
        </Link>
      </header>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Find a transaction
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
          />

          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as TransactionSort,
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="newest">
              Newest first
            </option>

            <option value="oldest">
              Oldest first
            </option>

            <option value="highest">
              Highest amount
            </option>

            <option value="lowest">
              Lowest amount
            </option>
          </select>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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

      {/* Filtered totals */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Filtered Income
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-500">
            {formatCurrency(transactionTotals.income)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Filtered Expenses
          </p>

          <p className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(transactionTotals.expenses)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Net Amount
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              netAmount >= 0
                ? "text-emerald-500"
                : "text-red-500"
            }`}
          >
            {formatCurrency(netAmount)}
          </p>
        </div>
      </section>

      {/* Results count */}
      <div className="mt-6 flex min-h-6 items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-medium text-slate-900 dark:text-white">
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
            className="text-sm font-medium text-emerald-500 transition hover:text-emerald-400"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Transactions */}
      <div className="mt-6 space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              No transactions found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
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