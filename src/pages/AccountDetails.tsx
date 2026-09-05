import { useMemo } from "react"
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Landmark,
  Pencil,
  PiggyBank,
  Trash2,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { useAccountsContext } from "../context/AccountsContext"
import { useTransactionsContext } from "../context/TransactionsContext"
import type { AccountType } from "../types/account"
import { formatCurrency } from "../utils/currency"

const accountTypeLabels: Record<AccountType, string> = {
  cash: "Cash",
  checking: "Checking",
  savings: "Savings",
  credit: "Credit",
  investment: "Investment",
}

const accountTypeIcons: Record<AccountType, LucideIcon> = {
  cash: Wallet,
  checking: Landmark,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

function AccountDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    accounts,
    deleteAccount,
    loading: accountsLoading,
  } = useAccountsContext()

  const {
    transactions,
    loading: transactionsLoading,
  } = useTransactionsContext()

  const account = accounts.find(
    (currentAccount) => currentAccount.id === id,
  )

  const accountTransactions = useMemo(() => {
    if (!account) {
      return []
    }

    return transactions
      .filter(
        (transaction) =>
          transaction.accountId === account.id,
      )
      .sort((a, b) => {
        const dateDifference =
          new Date(b.date).getTime() -
          new Date(a.date).getTime()

        return dateDifference || b.id - a.id
      })
  }, [account, transactions])

  const totalIncome = useMemo(
    () =>
      accountTransactions
        .filter(
          (transaction) =>
            transaction.type === "income",
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0,
        ),
    [accountTransactions],
  )

  const totalExpenses = useMemo(
    () =>
      accountTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense",
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0,
        ),
    [accountTransactions],
  )

  const AccountIcon = account
    ? accountTypeIcons[account.type]
    : Wallet

  function handleDelete() {
    if (!account) {
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${account.name}"?`,
    )

    if (!confirmed) {
      return
    }

    deleteAccount(account.id)
    navigate("/accounts")
  }

  if (accountsLoading) {
    return (
      <section className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-[var(--surface-hover)]" />

        <div className="h-56 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />

        <div className="h-80 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />
      </section>
    )
  }

  if (!account) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-hover)]">
            <Wallet
              size={22}
              className="text-[var(--text-secondary)]"
            />
          </div>

          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Account not found
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            The account you're looking for doesn't
            exist or may have been deleted.
          </p>

          <Link
            to="/accounts"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft size={16} />
            Back to accounts
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/accounts"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={16} />
            Back to accounts
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <AccountIcon size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                {account.name}
              </h1>

              <div className="mt-1 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <span>
                  {accountTypeLabels[account.type]}
                </span>

                <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]" />

                <span className="inline-flex items-center gap-1.5 text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/accounts/${account.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]"
          >
            <Pencil size={16} />
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Balance Hero */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Account balance
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              {formatCurrency(
                account.balance,
                account.currency,
              )}
            </h2>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {account.currency} · {accountTypeLabels[account.type]}
            </p>
          </div>

          <Link
            to={`/transactions/new?accountId=${account.id}`}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <ArrowUpRight size={17} />
            Add transaction
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              Money received
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <ArrowDownRight size={18} />
            </div>
          </div>

          <p className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
            {formatCurrency(
              totalIncome,
              account.currency,
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              Money spent
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <p className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
            {formatCurrency(
              totalExpenses,
              account.currency,
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              Transactions
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <CreditCard size={18} />
            </div>
          </div>

          <p className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
            {accountTransactions.length}
          </p>
        </div>
      </div>

      {/* Account Information */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="border-b border-[var(--border)] px-6 py-5">
          <h2 className="font-semibold text-[var(--text-primary)]">
            Account information
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Details about this account.
          </p>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Account type
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
              {accountTypeLabels[account.type]}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Currency
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
              {account.currency}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Created
            </p>

            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
              <CalendarDays size={15} />
              {formatDate(account.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Account ID
            </p>

            <p className="mt-1 truncate text-sm font-medium text-[var(--text-primary)]">
              {account.id}
            </p>
          </div>
        </div>
      </div>

      {/* Account Activity */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">
              Account activity
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Transactions linked to this account.
            </p>
          </div>

          {accountTransactions.length > 0 && (
            <Link
              to="/transactions"
              className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
            >
              View all
            </Link>
          )}
        </div>

        {transactionsLoading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-lg bg-[var(--surface-hover)]"
              />
            ))}
          </div>
        ) : accountTransactions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-hover)]">
              <CreditCard
                size={20}
                className="text-[var(--text-secondary)]"
              />
            </div>

            <h3 className="font-medium text-[var(--text-primary)]">
              No transactions yet
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--text-secondary)]">
              Transactions linked to this account will
              appear here.
            </p>

            <Link
              to={`/transactions/new?accountId=${account.id}`}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <ArrowUpRight size={16} />
              Add transaction
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {accountTransactions.map((transaction) => {
              const isIncome =
                transaction.type === "income"

              return (
                <Link
                  key={transaction.id}
                  to={`/transactions/${transaction.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-[var(--surface-hover)]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        isIncome
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownRight size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                        {transaction.description}
                      </p>

                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {transaction.category} ·{" "}
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`shrink-0 text-sm font-semibold ${
                      isIncome
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {isIncome ? "+" : "−"}
                    {formatCurrency(
                      transaction.amount,
                      account.currency,
                    )}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default AccountDetails