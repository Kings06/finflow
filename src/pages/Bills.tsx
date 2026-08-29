import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useBillsContext } from "../context/BillsContext"
import { usePreferences } from "../context/PreferencesContext"
import { formatCurrency } from "../utils/currency"

function Bills() {
  const { bills } = useBillsContext()
  const { currency } = usePreferences()

  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const upcomingBills = useMemo(() => {
    return bills
      .filter((bill) => {
        const dueDate = new Date(bill.dueDate)
        dueDate.setHours(0, 0, 0, 0)

        return dueDate >= today
      })
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime(),
      )
  }, [bills, today])

  const overdueBills = useMemo(() => {
    return bills
      .filter((bill) => {
        const dueDate = new Date(bill.dueDate)
        dueDate.setHours(0, 0, 0, 0)

        return dueDate < today
      })
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime(),
      )
  }, [bills, today])

  const recurringBills = useMemo(
    () => bills.filter((bill) => bill.recurring),
    [bills],
  )

  const upcomingTotal = upcomingBills.reduce(
    (total, bill) => total + bill.amount,
    0,
  )

  const overdueTotal = overdueBills.reduce(
    (total, bill) => total + bill.amount,
    0,
  )

  const recurringTotal = recurringBills.reduce(
    (total, bill) => total + bill.amount,
    0,
  )

  const formatBillDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

  return (
    <div>
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-500">
            Financial commitments
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
            Bills
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Keep track of upcoming obligations before they
            affect your spending.
          </p>
        </div>

        <Link
          to="/bills/new"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          + Add Bill
        </Link>
      </header>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {/* Upcoming */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <p className="text-sm text-[var(--text-secondary)]">
            Upcoming
          </p>

          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {formatCurrency(upcomingTotal, currency)}
          </p>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {upcomingBills.length}{" "}
            {upcomingBills.length === 1 ? "bill" : "bills"}
          </p>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 shadow-sm">
          <p className="text-sm text-red-500">
            Overdue
          </p>

          <p className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(overdueTotal, currency)}
          </p>

          <p className="mt-1 text-sm text-red-500/70">
            {overdueBills.length}{" "}
            {overdueBills.length === 1 ? "bill" : "bills"} need
            attention
          </p>
        </div>

        {/* Recurring */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-sm">
          <p className="text-sm text-emerald-500">
            Recurring
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-500">
            {formatCurrency(recurringTotal, currency)}
          </p>

          <p className="mt-1 text-sm text-emerald-500/70">
            {recurringBills.length}{" "}
            {recurringBills.length === 1 ? "bill" : "bills"}
          </p>
        </div>
      </section>

      {/* Overdue Bills */}
      {overdueBills.length > 0 && (
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Needs attention
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              These bills have passed their due date.
            </p>
          </div>

          <div className="space-y-3">
            {overdueBills.map((bill) => (
              <div
                key={bill.id}
                className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {bill.name}
                    </h3>

                    {bill.recurring && (
                      <span className="rounded-full bg-[var(--surface-hover)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                        Recurring
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-red-500">
                    Due {formatBillDate(bill.dueDate)}
                  </p>
                </div>

                <p className="text-lg font-bold text-red-500">
                  {formatCurrency(bill.amount, currency)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Bills */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Upcoming bills
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Money you should account for before spending.
          </p>
        </div>

        {upcomingBills.length > 0 ? (
          <div className="space-y-3">
            {upcomingBills.map((bill) => (
              <div
                key={bill.id}
                className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:border-emerald-500/40 hover:bg-[var(--surface-hover)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {bill.name}
                    </h3>

                    {bill.recurring && (
                      <span className="rounded-full bg-[var(--surface-hover)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                        Recurring
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {bill.category} · Due{" "}
                    {formatBillDate(bill.dueDate)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500">
                    Upcoming
                  </span>

                  <p className="font-bold text-[var(--text-primary)]">
                    {formatCurrency(bill.amount, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              No upcoming bills
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
              Add your regular bills so FinFlow can factor
              them into your safe-to-spend calculation.
            </p>

            <Link
              to="/bills/new"
              className="mt-5 inline-flex rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Add your first bill
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default Bills