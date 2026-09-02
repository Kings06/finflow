import {
  useState,
  type FormEvent,
} from "react"

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  useTransactionsContext,
} from "../context/TransactionsContext"

import { formatCurrency } from "../utils/currency"

import type { TransactionType } from "../types/transaction"

const categories = [
  "Salary",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Others",
]

function TransactionDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    transactions,
    loading,
    error,
    editTransaction,
    removeTransaction,
  } = useTransactionsContext()

  const transaction = transactions.find(
    (item) => item.id === Number(id),
  )

  const [isEditing, setIsEditing] =
    useState(false)

  const [isSaving, setIsSaving] =
    useState(false)

  const [isDeleting, setIsDeleting] =
    useState(false)

  const [formError, setFormError] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [amount, setAmount] =
    useState("")

  const [type, setType] =
    useState<TransactionType>("expense")

  const [category, setCategory] =
    useState("Food")

  const [date, setDate] =
    useState("")

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Transaction Details
        </h1>

        <p className="mt-4 text-[var(--text-secondary)]">
          Loading transaction...
        </p>

        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-[var(--surface)]" />
      </div>
    )
  }

  if (error && !transaction) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Transaction Details
        </h1>

        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="font-medium text-red-400">
            Unable to load transaction
          </p>

          <p className="mt-2 text-sm text-red-400/80">
            {error}
          </p>
        </div>

        <Link
          to="/transactions"
          className="mt-6 inline-block text-sm font-medium text-emerald-500 transition hover:text-emerald-400"
        >
          ← Back to Transactions
        </Link>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Transaction Not Found
        </h1>

        <p className="mt-4 text-[var(--text-secondary)]">
          We couldn't find the transaction
          you're looking for.
        </p>

        <Link
          to="/transactions"
          className="mt-6 inline-block text-sm font-medium text-emerald-500 transition hover:text-emerald-400"
        >
          ← Back to Transactions
        </Link>
      </div>
    )
  }

  const isIncome =
    transaction.type === "income"

  const formattedDate = new Date(
    transaction.date,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const handleStartEditing = () => {
    setDescription(transaction.description)
    setAmount(
      transaction.amount.toString(),
    )
    setType(transaction.type)
    setCategory(transaction.category)
    setDate(transaction.date)
    setFormError("")
    setIsEditing(true)
  }

  const handleCancelEditing = () => {
    setDescription(transaction.description)
    setAmount(
      transaction.amount.toString(),
    )
    setType(transaction.type)
    setCategory(transaction.category)
    setDate(transaction.date)
    setFormError("")
    setIsEditing(false)
  }

  const handleEdit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setFormError("")

    const trimmedDescription =
      description.trim()

    const numericAmount = Number(amount)

    if (!trimmedDescription) {
      setFormError(
        "Please enter a description.",
      )
      return
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setFormError(
        "Please enter a valid amount greater than zero.",
      )
      return
    }

    if (!date) {
      setFormError(
        "Please select a date.",
      )
      return
    }

    try {
      setIsSaving(true)

      await editTransaction(
        transaction.id,
        {
          description: trimmedDescription,
          amount: numericAmount,
          type,
          category,
          date,
          ...(transaction.accountId
            ? {
                accountId:
                  transaction.accountId,
              }
            : {}),
        },
      )

      setIsEditing(false)
    } catch {
      setFormError(
        "Unable to update transaction. Please try again.",
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${transaction.description}"? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setIsDeleting(true)
      setFormError("")

      await removeTransaction(
        transaction.id,
      )

      navigate("/transactions")
    } catch {
      setFormError(
        "Unable to delete transaction. Please try again.",
      )

      setIsDeleting(false)
    }
  }

  return (
    <div>
      <Link
        to="/transactions"
        className="text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
      >
        ← Back to Transactions
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-[var(--text-secondary)]">
            Transaction Details
          </p>

          <h1 className="mt-2 truncate text-3xl font-bold text-[var(--text-primary)]">
            {transaction.description}
          </h1>
        </div>

        {!isEditing && (
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={handleStartEditing}
              disabled={isDeleting}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        )}
      </div>

      {formError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
        >
          {formError}
        </div>
      )}

      {isEditing ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm md:p-8">
          <form
            onSubmit={handleEdit}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-[var(--text-secondary)]"
              >
                Description
              </label>

              <input
                id="description"
                type="text"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                maxLength={120}
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="amount"
                  className="text-sm font-medium text-[var(--text-secondary)]"
                >
                  Amount
                </label>

                <input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="text-sm font-medium text-[var(--text-secondary)]"
                >
                  Date
                </label>

                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="type"
                  className="text-sm font-medium text-[var(--text-secondary)]"
                >
                  Type
                </label>

                <select
                  id="type"
                  value={type}
                  onChange={(event) =>
                    setType(
                      event.target
                        .value as TransactionType,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                >
                  <option value="expense">
                    Expense
                  </option>

                  <option value="income">
                    Income
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-[var(--text-secondary)]"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                >
                  {categories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  handleCancelEditing
                }
                disabled={isSaving}
                className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Amount
                </p>

                <h2
                  className={`mt-2 text-4xl font-bold ${
                    isIncome
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(
                    transaction.amount,
                  )}
                </h2>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
                  isIncome
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {isIncome
                  ? "Income"
                  : "Expense"}
              </span>
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <p className="text-sm text-[var(--text-muted)]">
                Description
              </p>

              <p className="mt-2 leading-6 text-[var(--text-primary)]">
                {transaction.description}
              </p>
            </div>

            <div className="mt-8 grid gap-6 border-t border-[var(--border)] pt-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Category
                </p>

                <p className="mt-2 font-medium text-[var(--text-primary)]">
                  {transaction.category}
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Date
                </p>

                <p className="mt-2 font-medium text-[var(--text-primary)]">
                  {formattedDate}
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Transaction ID
                </p>

                <p className="mt-2 font-medium text-[var(--text-primary)]">
                  #{transaction.id}
                </p>
              </div>
            </div>

            {transaction.accountId && (
              <div className="mt-8 border-t border-[var(--border)] pt-6">
                <p className="text-sm text-[var(--text-muted)]">
                  Account
                </p>

                <p className="mt-2 font-medium text-[var(--text-primary)]">
                  Linked account
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default TransactionDetails