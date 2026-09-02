import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Bus,
  CalendarDays,
  CreditCard,
  Film,
  Gift,
  ShoppingBag,
  Utensils,
} from "lucide-react"

import { Link } from "react-router-dom"

import type { Transaction } from "../types/transaction"

import { formatCurrency } from "../utils/currency"

type TransactionItemProps = {
  transaction: Transaction
}

function TransactionItem({
  transaction,
}: TransactionItemProps) {
  const isIncome =
    transaction.type === "income"

  const categoryIcons = {
    Salary: Banknote,
    Food: Utensils,
    Transport: Bus,
    Shopping: ShoppingBag,
    Bills: CreditCard,
    Entertainment: Film,
    Others: Gift,
  } as const

  const CategoryIcon =
    categoryIcons[transaction.category as keyof typeof categoryIcons] ??
    CreditCard

  const formattedDate = new Date(
    transaction.date,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link
      to={`/transactions/${transaction.id}`}
      aria-label={`View transaction: ${transaction.description}`}
      className="group block rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
    >
      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-hover)] sm:p-5">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isIncome
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            <CategoryIcon
              size={20}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-[var(--text-primary)] transition group-hover:text-emerald-500">
              {transaction.description}
            </h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)] sm:text-sm">
              <span className="inline-flex items-center gap-1">
                <CategoryIcon size={13} />
                {transaction.category}
              </span>

              <span className="hidden text-[var(--text-muted)] sm:inline">
                •
              </span>

              <span className="inline-flex items-center gap-1">
                <CalendarDays size={13} />
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right">
              <p
                className={`font-semibold ${
                  isIncome
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(
                  transaction.amount,
                )}
              </p>

              <p
                className={`mt-1 text-xs font-medium ${
                  isIncome
                    ? "text-emerald-500/70"
                    : "text-red-500/70"
                }`}
              >
                {isIncome
                  ? "Income"
                  : "Expense"}
              </p>
            </div>

            <div
              className={`hidden h-8 w-8 items-center justify-center rounded-lg transition duration-200 sm:flex ${
                isIncome
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {isIncome ? (
                <ArrowDownLeft size={17} />
              ) : (
                <ArrowUpRight size={17} />
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default TransactionItem