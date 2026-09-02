import {
  useMemo,
  useState,
} from "react"
import { Link } from "react-router-dom"

import {
  useTransactionsContext,
} from "../context/TransactionsContext"

import TransactionItem from "../components/TransactionItem"

import {
  calculateTransactionTotals,
  sortTransactions,
  type TransactionSort,
} from "../utils/transactions"

import { formatCurrency } from "../utils/currency"

type TransactionTypeFilter =
  | "all"
  | "income"
  | "expense"

function Transactions() {
  const {
    transactions,
    loading,
    error,
  } = useTransactionsContext()

  const [search, setSearch] = useState("")

  const [typeFilter, setTypeFilter] =
    useState<TransactionTypeFilter>("all")

  const [categoryFilter, setCategoryFilter] =
    useState("all")

  const [sort, setSort] =
    useState<TransactionSort>("newest")

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      transactions.map(
        (transaction) => transaction.category,
      ),
    )

    return [
      "all",
      ...Array.from(uniqueCategories).sort(
        (a, b) => a.localeCompare(b),
      ),
    ]
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase()

    const filtered = transactions.filter(
      (transaction) => {
        const matchesSearch =
          normalizedSearch === "" ||
          transaction.description
            .toLowerCase()
            .includes(normalizedSearch)

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
      },
    )

    return sortTransactions(filtered, sort)
  }, [
    transactions,
    search,
    typeFilter,
    categoryFilter,
    sort,
  ])

  const transactionTotals = useMemo(
    () =>
      calculateTransactionTotals(
        filteredTransactions,
      ),
    [filteredTransactions],
  )

  const netAmount =
    transactionTotals.income -
    transactionTotals.expenses

  const hasActiveFilters =
    search.trim() !== "" ||
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
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Transactions
        </h1>

        <p className="mt-2 text-[var(--text-secondary)]">
          Loading your financial activity...
        </p>

        <div className="mt-8 space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl bg-[var(--surface)]"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Transactions
        </h1>

        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
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

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-500">
            Financial activity
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
            Transactions
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            View and manage your financial
            transactions.
          </p>
        </div>

        <Link
          to="/transactions/new"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          + Add Transaction
        </Link>
      </header>

      <section
        className="mt-8 rounded-2xl border p-6 shadow-sm"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="mb-5">
          <h2
            className="text-sm font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            Find a transaction
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Search, filter, or sort your financial
            activity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="search"
            placeholder="Search transactions..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            aria-label="Search transactions"
            className="rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            style={{
              borderColor: "var(--border)",
              backgroundColor:
                "var(--surface-hover)",
              color: "var(--text-primary)",
            }}
          />

          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as TransactionSort,
              )
            }
            aria-label="Sort transactions"
            className="rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            style={{
              borderColor: "var(--border)",
              backgroundColor:
                "var(--surface-hover)",
              color: "var(--text-primary)",
            }}
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
              setTypeFilter(
                event.target.value as TransactionTypeFilter,
              )
            }
            aria-label="Filter by transaction type"
            className="rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            style={{
              borderColor: "var(--border)",
              backgroundColor:
                "var(--surface-hover)",
              color: "var(--text-primary)",
            }}
          >
            <option value="all">
              All Types
            </option>

            <option value="income">
              Income
            </option>

            <option value="expense">
              Expenses
            </option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            aria-label="Filter by category"
            className="rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            style={{
              borderColor: "var(--border)",
              backgroundColor:
                "var(--surface-hover)",
              color: "var(--text-primary)",
            }}
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

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div
          className="rounded-2xl border p-5 shadow-sm"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Filtered Income
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-500">
            {formatCurrency(
              transactionTotals.income,
            )}
          </p>
        </div>

        <div
          className="rounded-2xl border p-5 shadow-sm"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Filtered Expenses
          </p>

          <p className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(
              transactionTotals.expenses,
            )}
          </p>
        </div>

        <div
          className="rounded-2xl border p-5 shadow-sm"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
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

      <div className="mt-6 flex min-h-6 items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-secondary)]">
          Showing{" "}
          <span className="font-medium text-[var(--text-primary)]">
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

      <div className="mt-6 space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(
            (transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
              />
            ),
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              No transactions found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
              We couldn't find any transactions
              matching your current search or
              filters.
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