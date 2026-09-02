import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import {
  ArrowLeft,
  Check,
  Wallet,
} from "lucide-react"
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom"

import { useAccountsContext } from "../context/AccountsContext"
import type {
  AccountType,
} from "../types/account"
import type {
  Currency,
} from "../context/PreferencesContext"

const accountTypeLabels: Record<
  AccountType,
  string
> = {
  cash: "Cash",
  checking: "Checking",
  savings: "Savings",
  credit: "Credit",
  investment: "Investment",
}

const accountTypes: AccountType[] = [
  "cash",
  "checking",
  "savings",
  "credit",
  "investment",
]

const currencies: Currency[] = [
  "NGN",
  "USD",
  "EUR",
  "GBP",
]

function EditAccount() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    accounts,
    updateAccount,
  } = useAccountsContext()

  const account = accounts.find(
    (item) => item.id === id,
  )

  const [name, setName] = useState("")
  const [type, setType] =
    useState<AccountType>("checking")

  const [currency, setCurrency] =
    useState<Currency>("NGN")

  const [balance, setBalance] = useState("")

  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  /*
   * Load the selected account into the form.
   */
  useEffect(() => {
    if (!account) return

    setName(account.name)
    setType(account.type)
    setCurrency(account.currency)
    setBalance(String(account.balance))
  }, [account])

  /*
   * Account doesn't exist.
   */
  if (!account) {
    return (
      <div className="pb-10">
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
            The account you are trying to edit
            does not exist or may have been
            deleted.
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

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError("")

    const trimmedName = name.trim()
    const numericBalance = Number(balance)

    if (!trimmedName) {
      setError(
        "Please enter an account name.",
      )
      return
    }

    if (balance.trim() === "") {
      setError(
        "Please enter an account balance.",
      )
      return
    }

    if (!Number.isFinite(numericBalance)) {
      setError(
        "Please enter a valid balance.",
      )
      return
    }

    try {
      setSaving(true)

      updateAccount(account.id, {
        name: trimmedName,
        type,
        currency,
        balance: numericBalance,
      })

      navigate(
        `/accounts/${account.id}`,
      )
    } catch {
      setError(
        "Unable to update the account. Please try again.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pb-10">
      {/* Back navigation */}
      <Link
        to={`/accounts/${account.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-(--text-secondary) transition hover:text-(--text-primary)"
      >
        <ArrowLeft size={17} />
        Back to Account
      </Link>

      {/* Page header */}
      <header className="mt-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Wallet size={26} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-(--text-primary)">
              Edit Account
            </h1>

            <p className="mt-1 text-(--text-secondary)">
              Update the details for{" "}
              {account.name}.
            </p>
          </div>
        </div>
      </header>

      {/* Form */}
      <section className="mt-8 max-w-3xl rounded-2xl border border-(--border) bg-(--surface) p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Account name */}
          <div>
            <label
              htmlFor="account-name"
              className="text-sm font-medium text-(--text-secondary)"
            >
              Account name
            </label>

            <input
              id="account-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Main Bank Account"
              className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-sm text-(--text-primary) outline-none transition placeholder:text-(--text-muted) focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          {/* Account type + currency */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="account-type"
                className="text-sm font-medium text-(--text-secondary)"
              >
                Account type
              </label>

              <select
                id="account-type"
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value as AccountType,
                  )
                }
                className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
              >
                {accountTypes.map(
                  (accountType) => (
                    <option
                      key={accountType}
                      value={accountType}
                    >
                      {
                        accountTypeLabels[
                          accountType
                        ]
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="currency"
                className="text-sm font-medium text-(--text-secondary)"
              >
                Currency
              </label>

              <select
                id="currency"
                value={currency}
                onChange={(event) =>
                  setCurrency(
                    event.target.value as Currency,
                  )
                }
                className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
              >
                {currencies.map(
                  (currencyCode) => (
                    <option
                      key={currencyCode}
                      value={currencyCode}
                    >
                      {currencyCode}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {/* Balance */}
          <div>
            <label
              htmlFor="balance"
              className="text-sm font-medium text-(--text-secondary)"
            >
              Starting balance
            </label>

            <input
              id="balance"
              type="number"
              step="0.01"
              value={balance}
              onChange={(event) =>
                setBalance(event.target.value)
              }
              placeholder="0.00"
              className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-sm text-(--text-primary) outline-none transition placeholder:text-(--text-muted) focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />

            <p className="mt-2 text-xs leading-5 text-(--text-secondary)">
              This is the balance recorded when
              the account was created. Existing
              transactions remain unchanged.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-(--border) pt-6 sm:flex-row sm:justify-end">
            <Link
              to={`/accounts/${account.id}`}
              className="rounded-xl border border-(--border) px-5 py-3 text-center text-sm font-semibold text-(--text-secondary) transition hover:bg-(--surface-hover) hover:text-(--text-primary)"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={17} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default EditAccount