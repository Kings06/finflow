import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Hash,
  Landmark,
  Pencil,
  PiggyBank,
  Plus,
  Trash2,
  TrendingUp,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react"

import { useTransactionsContext } from "../context/TransactionsContext"
import { useAccountsContext } from "../context/AccountsContext"
import { usePreferences } from "../context/PreferencesContext"

import {
  calculateFinancialSummary,
} from "../utils/financial"

import { formatCurrency } from "../utils/currency"

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

const accountTypeIcons: Record<
  AccountType,
  LucideIcon
> = {
  cash: Wallet,
  checking: Landmark,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
}

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

  const financialSummary =
    useMemo(
      () =>
        calculateFinancialSummary(
          transactions,
        ),
      [transactions],
    )

  /*
   * Keep account balance behaviour exactly as it is.
   * We do not calculate account balances from transactions.
   * We also do not perform currency conversion.
   */
  const totalAccountBalance =
    accounts.reduce(
      (total, account) =>
        total + account.balance,
      0,
    )

  const recentTransactions =
    useMemo(() => {
      return [...transactions]
        .sort((a, b) => {
          const dateDifference =
            new Date(b.date).getTime() -
            new Date(a.date).getTime()

          if (dateDifference !== 0) {
            return dateDifference
          }

          return b.id - a.id
        })
        .slice(0, 5)
    }, [transactions])

  const getTransactionCurrency = (
    transactionAccountId?: string,
  ) => {
    if (!transactionAccountId) {
      return currency
    }

    const transactionAccount =
      accounts.find(
        (account) =>
          account.id ===
          transactionAccountId,
      )

    return (
      transactionAccount?.currency ??
      currency
    )
  }

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

  const handleUpdate = (
    accountId: string,
  ) => {
    const trimmedName =
      editName.trim()

    const numericBalance =
      Number(editBalance)

    if (!trimmedName) {
      return
    }

    if (!Number.isFinite(numericBalance)) {
      return
    }

    updateAccount(accountId, {
      name: trimmedName,
      type: editType,
      balance: numericBalance,
    })

    cancelEditing()
  }

  const handleDelete = (
    account: Account,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${account.name}"?`,
    )

    if (!confirmed) {
      return
    }

    deleteAccount(account.id)

    if (
      editingAccountId ===
      account.id
    ) {
      cancelEditing()
    }
  }

  const getAccountTransactions = (
    accountId: string,
  ) => {
    return transactions.filter(
      (transaction) =>
        transaction.accountId ===
        accountId,
    )
  }

  if (loading) {
    return (
      <main className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-40 animate-pulse rounded-lg bg-[var(--surface-hover)]" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-[var(--surface-hover)]" />
          </div>

          <div className="h-10 w-36 animate-pulse rounded-lg bg-[var(--surface-hover)]" />
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--surface-hover)]" />
                <div className="mt-4 h-8 w-32 animate-pulse rounded bg-[var(--surface-hover)]" />
              </div>
            ),
          )}
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              />
            ),
          )}
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Accounts
            </h1>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Manage your financial accounts.
            </p>
          </div>

          <Link
            to="/accounts/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Add Account
          </Link>
        </header>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-8">
      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Accounts
          </h1>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage your accounts and keep track
            of your financial activity.
          </p>
        </div>

        <Link
          to="/accounts/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus size={18} />
          Add Account
        </Link>
      </header>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Total Balance
              </p>

              <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                {formatCurrency(
                  totalAccountBalance,
                  currency,
                )}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Wallet size={20} />
            </div>
          </div>

          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Across {accounts.length}{" "}
            {accounts.length === 1
              ? "account"
              : "accounts"}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Accounts
              </p>

              <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                {accounts.length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
              <Hash size={20} />
            </div>
          </div>

          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Active financial accounts
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Income
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {formatCurrency(
                  financialSummary.totalIncome,
                  currency,
                )}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <ArrowDownLeft size={20} />
            </div>
          </div>

          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Total recorded income
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Expenses
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {formatCurrency(
                  financialSummary.totalExpenses,
                  currency,
                )}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <ArrowUpRight size={20} />
            </div>
          </div>

          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Total recorded expenses
          </p>
        </div>
      </section>

      {/* Accounts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Your Accounts
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              View balances and activity for
              each account.
            </p>
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Wallet size={26} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
              No accounts yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
              Add your first account to start
              organizing your finances and
              tracking your financial activity.
            </p>

            <Link
              to="/accounts/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              Add Your First Account
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
  {accounts.map((account) => {
    const Icon = accountTypeIcons[account.type]

    const accountTransactions =
      getAccountTransactions(account.id)

    const accountIncome =
      accountTransactions
        .filter(
          (transaction) =>
            transaction.type === "income",
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0,
        )

    const accountExpenses =
      accountTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense",
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0,
        )

    const isEditing =
      editingAccountId === account.id

    if (isEditing) {
      return (
        <article
          key={account.id}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">
                  Edit Account
                </h3>

                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Update your account information.
                </p>
              </div>

              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                aria-label="Cancel editing"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor={`account-name-${account.id}`}
                  className="mb-1.5 block text-xs font-medium text-[var(--text-primary)]"
                >
                  Account name
                </label>

                <input
                  id={`account-name-${account.id}`}
                  type="text"
                  value={editName}
                  onChange={(event) =>
                    setEditName(event.target.value)
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`account-type-${account.id}`}
                    className="mb-1.5 block text-xs font-medium text-[var(--text-primary)]"
                  >
                    Account type
                  </label>

                  <select
                    id={`account-type-${account.id}`}
                    value={editType}
                    onChange={(event) =>
                      setEditType(
                        event.target.value as AccountType,
                      )
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  >
                    {accountTypes.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`account-balance-${account.id}`}
                    className="mb-1.5 block text-xs font-medium text-[var(--text-primary)]"
                  >
                    Balance
                  </label>

                  <input
                    id={`account-balance-${account.id}`}
                    type="number"
                    step="0.01"
                    value={editBalance}
                    onChange={(event) =>
                      setEditBalance(event.target.value)
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdate(account.id)
                  }
                  className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-lg border border-[var(--border)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </article>
      )
    }

    return (
      <Link
        key={account.id}
        to={`/accounts/${account.id}`}
        className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        {/* Account Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
              <Icon size={19} />
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-[var(--text-primary)] group-hover:text-emerald-600">
                {account.name}
              </p>

              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                {getAccountTypeLabel(account.type)}
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
            Active
          </span>
        </div>

        {/* Balance */}
        <div className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Current balance
          </p>

          <p className="mt-0.5 text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {formatCurrency(
              account.balance,
              account.currency,
            )}
          </p>

          <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
            {account.currency}
          </p>
        </div>

        {/* Activity Summary */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]">
          <div className="px-2.5 py-2.5">
            <p className="text-[10px] text-[var(--text-muted)]">
              Transactions
            </p>

            <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
              {accountTransactions.length}
            </p>
          </div>

          <div className="px-2.5 py-2.5">
            <p className="text-[10px] text-[var(--text-muted)]">
              Income
            </p>

            <p className="mt-0.5 truncate text-xs font-semibold text-emerald-600">
              {formatCurrency(
                accountIncome,
                account.currency,
              )}
            </p>
          </div>

          <div className="px-2.5 py-2.5">
            <p className="text-[10px] text-[var(--text-muted)]">
              Expenses
            </p>

            <p className="mt-0.5 truncate text-xs font-semibold text-red-600">
              {formatCurrency(
                accountExpenses,
                account.currency,
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] text-[var(--text-muted)]">
              Created{" "}
              {new Date(
                account.createdAt,
              ).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            {accountTransactions.length === 0 && (
              <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
                No linked activity yet
              </p>
            )}
          </div>

          {/* Card Actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                startEditing(account)
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            >
              <Pencil size={12} />
              Edit
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                handleDelete(account)
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-[11px] font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>
      </Link>
    )
  })}
</div>
        )}
      </section>

      {/* Connected Accounts */}
      <section className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">
              Connected Accounts
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">
              Bank connections and automatic
              account synchronization will be
              available here in a future update.
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            Coming soon
          </span>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Your latest recorded financial
              activity.
            </p>
          </div>

          {transactions.length > 0 && (
            <Link
              to="/transactions"
              className="shrink-0 text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
            >
              View all
            </Link>
          )}
        </div>

        {recentTransactions.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              No recent activity yet.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="divide-y divide-[var(--border)]">
              {recentTransactions.map(
                (transaction) => {
                  const transactionAccount =
                    transaction.accountId
                      ? accounts.find(
                          (account) =>
                            account.id ===
                            transaction.accountId,
                        )
                      : undefined

                  const transactionCurrency =
                    getTransactionCurrency(
                      transaction.accountId,
                    )

                  const isIncome =
                    transaction.type ===
                    "income"

                  return (
                    <Link
                      key={transaction.id}
                      to={`/transactions/${transaction.id}`}
                      className="flex items-center gap-3 px-4 py-4 transition hover:bg-[var(--surface-hover)] sm:px-5"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft
                            size={18}
                          />
                        ) : (
                          <ArrowUpRight
                            size={18}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                          {
                            transaction.description
                          }
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
                          <span>
                            {
                              transaction.category
                            }
                          </span>

                          <span>
                            •
                          </span>

                          <span>
                            {new Date(
                              transaction.date,
                            ).toLocaleDateString(
                              undefined,
                              {
                                month:
                                  "short",
                                day: "numeric",
                                year:
                                  "numeric",
                              },
                            )}
                          </span>

                          {transactionAccount && (
                            <>
                              <span>
                                •
                              </span>

                              <span className="truncate">
                                {
                                  transactionAccount.name
                                }
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <p
                        className={`shrink-0 text-sm font-semibold ${
                          isIncome
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {isIncome
                          ? "+"
                          : "-"}
                        {formatCurrency(
                          transaction.amount,
                          transactionCurrency,
                        )}
                      </p>
                    </Link>
                  )
                },
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Accounts