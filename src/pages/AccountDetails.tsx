import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  CreditCard,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react"

import { useAccountsContext } from "../context/AccountsContext"
import { useTransactionsContext } from "../context/TransactionsContext"
import { formatCurrency } from "../utils/currency"
import type { AccountType } from "../types/account"

const accountTypeLabels: Record<AccountType, string> = {
  cash: "Cash",
  checking: "Checking",
  savings: "Savings",
  credit: "Credit",
  investment: "Investment",
}

function AccountDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { accounts, deleteAccount } = useAccountsContext()
  const { transactions } = useTransactionsContext()

  const account = accounts.find(
    (item) => item.id === id,
  )

  if (!account) {
    return (
      <div>
        <Link
          to="/accounts"
          className="inline-flex items-center gap-2 text-sm font-medium text-(--text-secondary) transition hover:text-(--text-primary)"
        >
          <ArrowLeft size={17} />
          Back to Accounts
        </Link>

        <div className="mt-8 rounded-2xl border border-(--border) bg-(--surface) p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <Wallet size={24} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-(--text-primary)">
            Account not found
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--text-secondary)">
            This account may have been deleted or
            may no longer exist.
          </p>

          <Link
            to="/accounts"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Back to Accounts
          </Link>
        </div>
      </div>
    )
  }

  /*
   * Only transactions belonging to this account.
   */
  const accountTransactions = transactions.filter(
    (transaction) =>
      transaction.accountId === account.id,
  )

  /*
   * Total money received by this account.
   */
  const totalIncome = accountTransactions
    .filter(
      (transaction) =>
        transaction.type === "income",
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0,
    )

  /*
   * Total money spent from this account.
   */
  const totalExpenses = accountTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense",
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0,
    )

  /*
   * Live balance.
   *
   * account.balance represents the starting
   * balance entered when the account was created.
   *
   * Current balance =
   * starting balance + income - expenses
   */
  const currentBalance =
    account.balance +
    totalIncome -
    totalExpenses

  const transactionCount =
    accountTransactions.length

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${account.name}"?\n\nThis account will be permanently removed from FinFlow. This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    deleteAccount(account.id)
    navigate("/accounts")
  }

  return (
    <div className="pb-10">
      {/* Back navigation */}
      <Link
        to="/accounts"
        className="inline-flex items-center gap-2 text-sm font-medium text-(--text-secondary) transition hover:text-(--text-primary)"
      >
        <ArrowLeft size={17} />
        Back to Accounts
      </Link>

      {/* Header */}
      <header className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Wallet size={26} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-(--text-primary)">
                {account.name}
              </h1>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                Active
              </span>
            </div>

            <p className="mt-1 text-(--text-secondary)">
              {accountTypeLabels[account.type]} account
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/accounts/${account.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-(--border) px-4 py-2.5 text-sm font-medium text-(--text-secondary) transition hover:bg-(--surface-hover) hover:text-(--text-primary)"
          >
            <Pencil size={16} />
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </header>

      {/* Balance hero */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-(--border) bg-(--surface) p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-(--text-secondary)">
              Current balance
            </p>

            <p
              className={`mt-3 text-4xl font-bold tracking-tight ${
                currentBalance >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {formatCurrency(
                currentBalance,
                account.currency,
              )}
            </p>

            <p className="mt-2 text-sm text-(--text-secondary)">
              {accountTypeLabels[account.type]} ·{" "}
              {account.currency}
            </p>
          </div>

          <Link
            to={`/transactions/new?accountId=${account.id}`}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Add Transaction
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Account metrics */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-(--background) p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ArrowUpRight size={17} />

              <p className="text-xs font-medium uppercase tracking-wide">
                Money received
              </p>
            </div>

            <p className="mt-3 text-xl font-bold text-(--text-primary)">
              {formatCurrency(
                totalIncome,
                account.currency,
              )}
            </p>
          </div>

          <div className="rounded-xl bg-(--background) p-4">
            <div className="flex items-center gap-2 text-red-400">
              <ArrowDownRight size={17} />

              <p className="text-xs font-medium uppercase tracking-wide">
                Money spent
              </p>
            </div>

            <p className="mt-3 text-xl font-bold text-(--text-primary)">
              {formatCurrency(
                totalExpenses,
                account.currency,
              )}
            </p>
          </div>

          <div className="rounded-xl bg-(--background) p-4">
            <div className="flex items-center gap-2 text-(--text-secondary)">
              <CreditCard size={17} />

              <p className="text-xs font-medium uppercase tracking-wide">
                Transactions
              </p>
            </div>

            <p className="mt-3 text-xl font-bold text-(--text-primary)">
              {transactionCount}
            </p>
          </div>
        </div>
      </section>

      {/* Account information */}
      <section className="mt-8 rounded-2xl border border-(--border) bg-(--surface) p-6">
        <div>
          <h2 className="text-xl font-semibold text-(--text-primary)">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-(--text-secondary)">
            Details about this financial account.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-(--border) bg-(--background) p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-(--text-secondary)">
              Account name
            </p>

            <p className="mt-2 font-semibold text-(--text-primary)">
              {account.name}
            </p>
          </div>

          <div className="rounded-xl border border-(--border) bg-(--background) p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-(--text-secondary)">
              Account type
            </p>

            <p className="mt-2 font-semibold text-(--text-primary)">
              {accountTypeLabels[account.type]}
            </p>
          </div>

          <div className="rounded-xl border border-(--border) bg-(--background) p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-(--text-secondary)">
              Currency
            </p>

            <p className="mt-2 font-semibold text-(--text-primary)">
              {account.currency}
            </p>
          </div>

          <div className="rounded-xl border border-(--border) bg-(--background) p-4">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={15}
                className="text-(--text-secondary)"
              />

              <p className="text-xs font-medium uppercase tracking-wide text-(--text-secondary)">
                Date added
              </p>
            </div>

            <p className="mt-2 font-semibold text-(--text-primary)">
              {new Date(
                account.createdAt,
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Account activity */}
      <section className="mt-8 rounded-2xl border border-(--border) bg-(--surface) p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-(--text-primary)">
              Account Activity
            </h2>

            <p className="mt-1 text-sm text-(--text-secondary)">
              Transactions associated with this account.
            </p>
          </div>

          <span className="rounded-full bg-(--surface-hover) px-3 py-1 text-xs font-medium text-(--text-secondary)">
            {transactionCount}{" "}
            {transactionCount === 1
              ? "transaction"
              : "transactions"}
          </span>
        </div>

        {accountTransactions.length > 0 ? (
          <div className="mt-6 space-y-3">
            {accountTransactions.map(
              (transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-3 rounded-xl border border-(--border) bg-(--background) p-4 transition hover:border-(--text-secondary) sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        transaction.type === "income"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {transaction.type ===
                      "income" ? (
                        <ArrowUpRight size={18} />
                      ) : (
                        <ArrowDownRight size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-(--text-primary)">
                        {transaction.description}
                      </p>

                      <p className="mt-1 text-sm text-(--text-secondary)">
                        {transaction.category} ·{" "}
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
                  </div>

                  <p
                    className={`shrink-0 font-semibold ${
                      transaction.type === "income"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {transaction.type === "income"
                      ? "+"
                      : "-"}
                    {formatCurrency(
                      transaction.amount,
                      account.currency,
                    )}
                  </p>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-(--border) p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-(--surface-hover) text-(--text-secondary)">
              <CreditCard size={21} />
            </div>

            <p className="mt-4 font-semibold text-(--text-primary)">
              No transactions yet
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--text-secondary)">
              Transactions associated with this
              account will appear here once you
              start recording your activity.
            </p>

            <Link
              to={`/transactions/new?accountId=${account.id}`}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Add Transaction
              <ArrowUpRight size={17} />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default AccountDetails