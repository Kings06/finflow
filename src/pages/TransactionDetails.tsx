import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useTransactionsContext } from "../context/TransactionsContext"
import { formatCurrency } from "../utils/currency"

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

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formError, setFormError] = useState("")

  const [description, setDescription] = useState(
    transaction?.description ?? "",
  )

  const [amount, setAmount] = useState(
    transaction?.amount.toString() ?? "",
  )

  const [type, setType] = useState<"income" | "expense">(
    transaction?.type ?? "expense",
  )

  const [category, setCategory] = useState(
    transaction?.category ?? "Food",
  )

  const [date, setDate] = useState(
    transaction?.date ?? "",
  )

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Transaction Details
        </h1>

        <p className="mt-4 text-[var(--text-secondary)]">
          Loading transaction...
        </p>
      </div>
    )
  }

  if (error && !transaction) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Transaction Details
        </h1>

        <p className="mt-4 text-red-400">
          {error}
        </p>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Transaction Not Found
        </h1>

        <p className="mt-4 text-[var(--text-secondary)]">
          We couldn't find the transaction you're looking for.
        </p>

        <Link
          to="/transactions"
          className="mt-6 inline-block text-emerald-400 transition hover:text-emerald-300"
        >
          ← Back to Transactions
        </Link>
      </div>
    )
  }

  const isIncome = transaction.type === "income"

  const formattedDate = new Date(
    transaction.date,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const handleEdit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setFormError("")

    const numericAmount = Number(amount)

    if (!description.trim()) {
      setFormError("Please enter a description.")
      return
    }

    if (!numericAmount || numericAmount <= 0) {
      setFormError("Please enter a valid amount.")
      return
    }

    if (!date) {
      setFormError("Please select a date.")
      return
    }

    try {
      setIsSaving(true)

      await editTransaction(transaction.id, {
        description: description.trim(),
        amount: numericAmount,
        type,
        category,
        date,
      })

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
      "Are you sure you want to delete this transaction? This action cannot be undone.",
    )

    if (!confirmed) {
      return
    }

    try {
      setIsDeleting(true)
      setFormError("")

      await removeTransaction(transaction.id)

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
        className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
      >
        ← Back to Transactions
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Transaction Details
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {transaction.description}
          </h1>
        </div>

        {!isEditing && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setDescription(transaction.description)
                setAmount(transaction.amount.toString())
                setType(transaction.type)
                setCategory(transaction.category)
                setDate(transaction.date)
                setFormError("")
                setIsEditing(true)
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface-hover)]"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {formError && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {formError}
        </div>
      )}

      {isEditing ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
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
                  setDescription(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
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
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
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
                    setDate(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
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
                      event.target.value as
                        | "income"
                        | "expense",
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
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
                    setCategory(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                >
                  {categories.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormError("")
                }}
                className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface-hover)]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Amount
                </p>

                <h2
                  className={`mt-2 text-4xl font-bold ${
                    isIncome
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </h2>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
                  isIncome
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-red-400/10 text-red-400"
                }`}
              >
                {isIncome ? "Income" : "Expense"}
              </span>
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <p className="text-sm text-[var(--text-muted)]">
                Description
              </p>

              <p className="mt-2 leading-6">
                {transaction.description}
              </p>
            </div>

            <div className="mt-8 grid gap-6 border-t border-[var(--border)] pt-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Category
                </p>

                <p className="mt-2 font-medium">
                  {transaction.category}
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Date
                </p>

                <p className="mt-2 font-medium">
                  {formattedDate}
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Transaction ID
                </p>

                <p className="mt-2 font-medium">
                  #{transaction.id}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default TransactionDetails