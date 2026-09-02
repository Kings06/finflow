import { useState } from "react"
import type { FormEvent } from "react"
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom"

import { useTransactionsContext } from "../context/TransactionsContext"
import { useAccountsContext } from "../context/AccountsContext"
import type { TransactionType } from "../types/transaction"
import type { Currency } from "../context/PreferencesContext"

const categories = [
  "Salary",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Others",
]

function AddTransaction() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { addTransaction } = useTransactionsContext()
  const { accounts } = useAccountsContext()

  const accountIdFromUrl =
    searchParams.get("accountId")

  const initialAccountId =
    accountIdFromUrl &&
    accounts.some(
      (account) => account.id === accountIdFromUrl,
    )
      ? accountIdFromUrl
      : ""

  const selectedAccount = accounts.find(
    (account) => account.id === initialAccountId,
  )

  const [description, setDescription] =
    useState("")

  const [amount, setAmount] =
    useState("")

  const [type, setType] =
    useState<TransactionType>("expense")

  const [category, setCategory] =
    useState("Food")

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0],
  )

  const [selectedAccountId, setSelectedAccountId] =
    useState(initialAccountId)

  const [submitting, setSubmitting] =
    useState(false)

  const [error, setError] =
    useState("")

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError("")

    const trimmedDescription =
      description.trim()

    const numericAmount = Number(amount)

    if (!trimmedDescription) {
      setError(
        "Please enter a transaction description.",
      )
      return
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError("Please enter a valid amount.")
      return
    }

    if (!date) {
      setError("Please select a date.")
      return
    }

    if (!selectedAccountId) {
      setError("Please select an account.")
      return
    }

    const accountExists = accounts.some(
      (account) =>
        account.id === selectedAccountId,
    )

    if (!accountExists) {
      setError(
        "The selected account could not be found.",
      )
      return
    }

    try {
      setSubmitting(true)

      await addTransaction({
        description: trimmedDescription,
        amount: numericAmount,
        type,
        category,
        date,
        accountId: selectedAccountId,
      })

      navigate(
        `/accounts/${selectedAccountId}`,
      )
    } catch {
      setError(
        "Unable to create transaction. Please try again.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const backPath = selectedAccountId
    ? `/accounts/${selectedAccountId}`
    : "/transactions"

  return (
    <div>
      <header>
        <Link
          to={backPath}
          className="text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
        >
          ←{" "}
          {selectedAccount
            ? selectedAccount.name
            : "Transactions"}
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-[var(--text-primary)]">
          Add Transaction
        </h1>

        <p className="mt-2 text-[var(--text-secondary)]">
          Record a new income or expense.
        </p>
      </header>

      <section className="mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
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
              placeholder="e.g. Monthly salary"
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
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="0.00"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
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
                Transaction Type
              </label>

              <select
                id="type"
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value as TransactionType,
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
                  setCategory(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
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

          <div>
            <label
              htmlFor="account"
              className="text-sm font-medium text-[var(--text-secondary)]"
            >
              Account
            </label>

            <select
              id="account"
              value={selectedAccountId}
              onChange={(event) =>
                setSelectedAccountId(
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            >
              <option value="">
                Select an account
              </option>

              {accounts.map((account) => (
                <option
                  key={account.id}
                  value={account.id}
                >
                  {account.name} —{" "}
                  {formatCurrencyPreview(
                    account.balance,
                    account.currency,
                  )}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to={backPath}
              className="rounded-xl border border-[var(--border)] px-5 py-3 text-center text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : "Add Transaction"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function formatCurrencyPreview(
  amount: number,
  accountCurrency: Currency,
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: accountCurrency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default AddTransaction