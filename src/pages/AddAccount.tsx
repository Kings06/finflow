import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Wallet } from "lucide-react"
import { useAccountsContext } from "../context/AccountsContext"
import type { Currency } from "../context/PreferencesContext"
import type { AccountType } from "../types/account"

const accountTypes: {
  value: AccountType
  label: string
  description: string
}[] = [
  {
    value: "checking",
    label: "Checking",
    description: "Your everyday spending account",
  },
  {
    value: "savings",
    label: "Savings",
    description: "Money set aside for future needs",
  },
  {
    value: "cash",
    label: "Cash",
    description: "Physical cash you currently hold",
  },
  {
    value: "credit",
    label: "Credit",
    description: "Credit card or borrowed funds",
  },
  {
    value: "investment",
    label: "Investment",
    description: "Stocks, funds, or other investments",
  },
]

function AddAccount() {
  const navigate = useNavigate()
  const { addAccount } = useAccountsContext()

  const [name, setName] = useState("")
  const [type, setType] =
    useState<AccountType>("checking")
  const [balance, setBalance] = useState("")
  const [currency, setCurrency] =
  useState<Currency>("NGN")
  const [error, setError] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const trimmedName = name.trim()
    const numericBalance = Number(balance)

    if (!trimmedName) {
      setError("Please enter an account name.")
      return
    }

    if (!balance || Number.isNaN(numericBalance)) {
      setError("Please enter a valid balance.")
      return
    }

    addAccount({
      name: trimmedName,
      type,
      balance: numericBalance,
      currency,
    })

    navigate("/accounts")
  }

  return (
    <div>
      <Link
        to="/accounts"
        className="inline-flex items-center gap-2 text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary)"
      >
        <ArrowLeft size={17} />
        Back to Accounts
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10">
            <Wallet size={21} />
          </div>

          <div>
            <p className="text-sm font-medium text-emerald-500">
              Account management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-(--text-primary)">
              Add Account
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-(--text-secondary)">
          Add a financial account to keep your balances
          organized and give FinFlow a clearer picture of
          your money.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl space-y-6"
      >
        <section className="rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-(--text-primary)">
              Account details
            </h2>

            <p className="mt-1 text-sm text-(--text-secondary)">
              Tell FinFlow a little about this account.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="account-name"
                className="block text-sm font-medium text-(--text-primary)"
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
                placeholder="e.g. GTBank Checking"
                className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-(--text-primary) outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />

              <p className="mt-2 text-xs text-(--text-secondary)">
                Choose a name that makes this account easy
                to recognize.
              </p>
            </div>

            <div>
              <label
                htmlFor="account-type"
                className="block text-sm font-medium text-(--text-primary)"
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
                className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-(--text-primary) outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              >
                {accountTypes.map((accountType) => (
                  <option
                    key={accountType.value}
                    value={accountType.value}
                  >
                    {accountType.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-(--text-secondary)">
                {
                  accountTypes.find(
                    (item) => item.value === type,
                  )?.description
                }
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="account-balance"
                  className="block text-sm font-medium text-(--text-primary)"
                >
                  Current balance
                </label>

                <input
                  id="account-balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={balance}
                  onChange={(event) =>
                    setBalance(event.target.value)
                  }
                  placeholder="0.00"
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-(--text-primary) outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="account-currency"
                  className="block text-sm font-medium text-(--text-primary)"
                >
                  Currency
                </label>

                <select
                  id="account-currency"
                  value={currency}
                  onChange={(event) =>
                    setCurrency(event.target.value as Currency)
                  }
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-(--text-primary) outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                >
                  <option value="NGN">
                    Nigerian Naira (NGN)
                  </option>
                  <option value="USD">
                    US Dollar (USD)
                  </option>
                  <option value="GBP">
                    British Pound (GBP)
                  </option>
                  <option value="EUR">
                    Euro (EUR)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/accounts"
            className="inline-flex items-center justify-center rounded-xl border border-(--border) px-5 py-3 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--surface-hover)"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Add Account
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddAccount