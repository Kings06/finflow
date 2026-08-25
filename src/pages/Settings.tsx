import { useState } from "react"
import { useTheme, type Theme } from "../context/ThemeContext"
import {
  usePreferences,
  type Currency,
} from "../context/PreferencesContext"

function Settings() {
  const { theme, setTheme } = useTheme()

  const {
    name,
    email,
    currency,
    notifications,
    setName,
    setEmail,
    setCurrency,
    setNotifications,
  } = usePreferences()

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-(--text-primary)">
        Settings
      </h1>

      <p className="mt-2 text-(--text-secondary)">
        Manage your FinFlow preferences.
      </p>

      <div className="mt-8 space-y-6">
        {/* Profile */}
        <section className="rounded-2xl border border-(--border) bg-(--surface) p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            Profile
          </h2>

          <p className="mt-1 text-sm text-(--text-secondary)">
            Manage your personal account information.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="text-sm text-(--text-secondary)"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm text-(--text-secondary)"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-2xl border border-(--border) bg-(--surface) p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-(--text-secondary)">
            Customize how FinFlow looks on your device.
          </p>

          <div className="mt-6 max-w-md">
            <label
              htmlFor="theme"
              className="text-sm text-(--text-secondary)"
            >
              Theme
            </label>

            <select
              id="theme"
              value={theme}
              onChange={(event) =>
                setTheme(event.target.value as Theme)
              }
              className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-emerald-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-2xl border border-(--border) bg-(--surface) p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            Preferences
          </h2>

          <p className="mt-1 text-sm text-(--text-secondary)">
            Customize how FinFlow displays your financial
            information.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="currency"
                className="text-sm text-(--text-secondary)"
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
                className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-emerald-500"
              >
                <option value="NGN">
                  Nigerian Naira (₦)
                </option>

                <option value="USD">
                  US Dollar ($)
                </option>

                <option value="EUR">
                  Euro (€)
                </option>

                <option value="GBP">
                  British Pound (£)
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm text-(--text-secondary)">
                Notifications
              </label>

              <div className="mt-2 flex h-11.5 items-center justify-between rounded-xl border border-(--border) bg-(--background) px-4">
                <span className="text-sm text-(--text-primary)">
                  Transaction alerts
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications(!notifications)
                  }
                  aria-label="Toggle notifications"
                  aria-pressed={notifications}
                  className={`relative h-6 w-11 rounded-full transition ${
                    notifications
                      ? "bg-emerald-500"
                      : "bg-(--surface-hover)"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      notifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              <p className="mt-2 text-xs text-(--text-secondary)">
                Notifications are{" "}
                {notifications
                  ? "enabled"
                  : "disabled"}
                .
              </p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-2xl border border-(--border) bg-(--surface) p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-(--text-primary)">
            Security
          </h2>

          <p className="mt-1 text-sm text-(--text-secondary)">
            Manage your account security settings.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-(--text-primary)">
                Password
              </p>

              <p className="mt-1 text-sm text-(--text-secondary)">
                Change your account password.
              </p>
            </div>

            <button
              type="button"
              className="w-full rounded-xl border border-(--border) px-4 py-2 text-sm font-medium text-(--text-primary) transition hover:border-(--text-secondary) hover:bg-(--surface-hover) sm:w-auto"
            >
              Change password
            </button>
          </div>
        </section>

        {/* Save */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-(--border) pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-(--text-secondary)">
            Your preferences are saved automatically.
          </p>

          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 sm:w-auto"
          >
            {saved
              ? "Preferences Saved ✓"
              : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings