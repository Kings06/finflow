import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Pencil,
  Trash2,
  X,
  Wallet,
} from "lucide-react"

import {
  useTransactionsContext,
} from "../context/TransactionsContext"

import {
  useAccountsContext,
} from "../context/AccountsContext"

import {
  usePreferences,
} from "../context/PreferencesContext"

import {
  calculateFinancialSummary,
} from "../utils/financial"

import {
  formatCurrency,
} from "../utils/currency"

import type {
  Account,
  AccountType,
} from "../types/account"

const accountTypes: {
  value: AccountType
  label: string
}[] = [
  {
    value: "cash",
    label: "Cash",
  },
  {
    value: "checking",
    label: "Checking",
  },
  {
    value: "savings",
    label: "Savings",
  },
  {
    value: "credit",
    label: "Credit",
  },
  {
    value: "investment",
    label: "Investment",
  },
]

function getAccountTypeLabel(
  type: AccountType,
) {
  return (
    accountTypes.find(
      (accountType) =>
        accountType.value === type,
    )?.label ?? type
  )
}

function Accounts() {
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useTransactionsContext()

  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
    updateAccount,
    deleteAccount,
  } = useAccountsContext()

  const { currency } = usePreferences()

  const [
    editingAccountId,
    setEditingAccountId,
  ] = useState<string | null>(null)

  const [editName, setEditName] =
    useState("")

  const [editType, setEditType] =
    useState<AccountType>("checking")

  const [editBalance, setEditBalance] =
    useState("")

  const loading =
    transactionsLoading || accountsLoading

  const error =
    accountsError ?? transactionsError

  const startEditing = (
    account: Account,
  ) => {
    setEditingAccountId(account.id)
    setEditName(account.name)
    setEditType(account.type)
    setEditBalance(
      String(account.balance),
    )
  }

  const cancelEditing = () => {
    setEditingAccountId(null)
    setEditName("")
    setEditType("checking")
    setEditBalance("")
  }

  const handleUpdate = () => {
    if (!editingAccountId) {
      return
    }

    const trimmedName = editName.trim()
    const numericBalance =
      Number(editBalance)

    if (!trimmedName) {
      return
    }

    if (!Number.isFinite(numericBalance)) {
      return
    }

    updateAccount(
      editingAccountId,
      {
        name: trimmedName,
        type: editType,
        balance: numericBalance,
      },
    )

    cancelEditing()
  }

  const handleDelete = (
    accountId: string,
    accountName: string,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${accountName}"? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    deleteAccount(accountId)

    if (editingAccountId === accountId) {
      cancelEditing()
    }
  }

  if (loading) {
    return (
      <div>
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              Account management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
              Accounts
            </h1>

            <p className="mt-2 text-[var(--text-secondary)]">
              Manage the accounts you use to
              organize your money.
            </p>
          </div>

          <Link
            to="/accounts/new"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            + Add Account
          </Link>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            />
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              Account management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
              Accounts
            </h1>

            <p className="mt-2 text-[var(--text-secondary)]">
              Manage the accounts you use to
              organize your money.
            </p>
          </div>

          <Link
            to="/accounts/new"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            + Add Account
          </Link>
        </header>

        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-sm font-semibold text-red-400">
            Unable to load account data.
          </p>

          <p className="mt-2 text-sm text-red-400/80">
            {error}
          </p>
        </div>
      </div>
    )
  }

  const summary =
    calculateFinancialSummary(
      transactions,
    )

  const totalAccountBalance =
    accounts.reduce(
      (total, account) =>
        total + account.balance,
      0,
    )

  const accountSummary = [
    {
      name: "Total Balance",
      type: "Across all accounts",
      amount: totalAccountBalance,
      description: `${accounts.length} account${
        accounts.length === 1
          ? ""
          : "s"
      } connected`,
      className:
        totalAccountBalance >= 0
          ? "text-emerald-400"
          : "text-red-400",
    },
    {
      name: "Income",
      type: "Money Received",
      amount: summary.totalIncome,
      description:
        "Total incoming funds",
      className: "text-emerald-400",
    },
    {
      name: "Expenses",
      type: "Money Spent",
      amount: summary.totalExpenses,
      description:
        "Total outgoing funds",
      className: "text-red-400",
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-400">
            Account management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
            Accounts
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Manage the accounts you use to
            organize your money.
          </p>
        </div>

        <Link
          to="/accounts/new"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-400 hover:shadow-md"
        >
          + Add Account
        </Link>
      </header>

      {/* Summary */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {accountSummary.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition duration-200 hover:border-[var(--text-secondary)]"
          >
            <p className="text-sm text-[var(--text-secondary)]">
              {item.type}
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
              {item.name}
            </h2>

            <p
              className={`mt-8 text-3xl font-bold ${item.className}`}
            >
              {formatCurrency(
                item.amount,
                currency,
              )}
            </p>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      {/* Accounts */}
      <section className="mt-8">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            My Accounts
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Keep track of the accounts you
            use to manage your money.
          </p>
        </div>

        {accounts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.map((account) => {
              const isEditing =
                editingAccountId ===
                account.id

              const accountTypeLabel =
                getAccountTypeLabel(
                  account.type,
                )

              return (
                <article
                  key={account.id}
                  className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition duration-200 hover:border-[var(--text-secondary)]"
                >
                  {isEditing ? (
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                            Edit account
                          </h3>

                          <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            Update this
                            account's
                            details.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={
                            cancelEditing
                          }
                          className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                          aria-label="Cancel editing"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="mt-6 grid gap-4">
                        <div>
                          <label
                            htmlFor={`account-name-${account.id}`}
                            className="text-sm font-medium text-[var(--text-secondary)]"
                          >
                            Account name
                          </label>

                          <input
                            id={`account-name-${account.id}`}
                            value={editName}
                            onChange={(event) =>
                              setEditName(
                                event.target
                                  .value,
                              )
                            }
                            maxLength={60}
                            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-emerald-400"
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor={`account-type-${account.id}`}
                              className="text-sm font-medium text-[var(--text-secondary)]"
                            >
                              Account type
                            </label>

                            <select
                              id={`account-type-${account.id}`}
                              value={editType}
                              onChange={(event) =>
                                setEditType(
                                  event.target
                                    .value as AccountType,
                                )
                              }
                              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-emerald-400"
                            >
                              {accountTypes.map(
                                (type) => (
                                  <option
                                    key={
                                      type.value
                                    }
                                    value={
                                      type.value
                                    }
                                  >
                                    {
                                      type.label
                                    }
                                  </option>
                                ),
                              )}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor={`account-balance-${account.id}`}
                              className="text-sm font-medium text-[var(--text-secondary)]"
                            >
                              Balance
                            </label>

                            <input
                              id={`account-balance-${account.id}`}
                              type="number"
                              step="0.01"
                              value={
                                editBalance
                              }
                              onChange={(event) =>
                                setEditBalance(
                                  event.target
                                    .value,
                                )
                              }
                              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-emerald-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap justify-end gap-3">
                        <button
                          type="button"
                          onClick={
                            cancelEditing
                          }
                          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={
                            handleUpdate
                          }
                          disabled={
                            !editName.trim() ||
                            !Number.isFinite(
                              Number(
                                editBalance,
                              ),
                            )
                          }
                          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                            <Wallet size={21} />
                          </div>

                          <div className="min-w-0">
                            <Link
                              to={`/accounts/${account.id}`}
                              className="block truncate text-lg font-semibold text-[var(--text-primary)] transition hover:text-emerald-400"
                            >
                              {account.name}
                            </Link>

                            <p className="mt-1 text-sm text-[var(--text-secondary)]">
                              {
                                accountTypeLabel
                              }
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                          Active
                        </span>
                      </div>

                      <Link
                        to={`/accounts/${account.id}`}
                        className="group mt-8 block"
                      >
                        <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                          Current balance
                        </p>

                        <p
                          className={`mt-2 text-3xl font-bold transition ${
                            account.balance >=
                            0
                              ? "text-[var(--text-primary)] group-hover:text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatCurrency(
                            account.balance,
                            account.currency,
                          )}
                        </p>
                      </Link>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
                        <div>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Currency
                          </p>

                          <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                            {
                              account.currency
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Added
                          </p>

                          <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                            {new Date(
                              account.createdAt,
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month:
                                  "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                account,
                              )
                            }
                            className="rounded-xl border border-[var(--border)] p-2.5 text-[var(--text-secondary)] transition hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-400"
                            aria-label={`Edit ${account.name}`}
                          >
                            <Pencil
                              size={17}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                account.id,
                                account.name,
                              )
                            }
                            className="rounded-xl border border-[var(--border)] p-2.5 text-[var(--text-secondary)] transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Delete ${account.name}`}
                          >
                            <Trash2
                              size={17}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet size={22} />
            </div>

            <p className="mt-4 font-medium text-[var(--text-primary)]">
              No accounts added yet
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
              Add an account to start
              organizing your money across
              FinFlow.
            </p>

            <Link
              to="/accounts/new"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              + Add Account
            </Link>
          </div>
        )}
      </section>

      {/* Connected Accounts */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Connected Accounts
        </h2>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Your financial data is currently
          being managed through FinFlow.
        </p>

        <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-6 text-center">
          <p className="font-medium text-[var(--text-primary)]">
            No external accounts
            connected
          </p>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Bank account connections can
            be added here in a future
            integration.
          </p>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Your latest account
              transactions.
            </p>
          </div>

          <Link
            to="/transactions"
            className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {transactions
            .slice(0, 5)
            .map((transaction) => (
              <Link
                key={transaction.id}
                to={`/transactions/${transaction.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition hover:border-[var(--text-secondary)]"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-[var(--text-primary)]">
                    {
                      transaction.description
                    }
                  </p>

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {
                      transaction.category
                    }{" "}
                    ·{" "}
                    {new Date(
                      transaction.date,
                    ).toLocaleDateString(
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
                  className={`ml-4 shrink-0 font-semibold ${
                    transaction.type ===
                    "income"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {transaction.type ===
                  "income"
                    ? "+"
                    : "-"}
                  {formatCurrency(
                    transaction.amount,
                    currency,
                  )}
                </p>
              </Link>
            ))}

          {transactions.length === 0 && (
            <p className="py-6 text-center text-sm text-[var(--text-secondary)]">
              No account activity yet.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Accounts