import { useState } from "react"
import { useTheme, type Theme } from "../context/ThemeContext"

function Settings() {
  const { theme, setTheme } = useTheme()

  const [notifications, setNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">
        Settings
      </h1>

      <p className="mt-2 text-[var(--text-secondary)]">
        Manage your FinFlow preferences.
      </p>

      <div className="mt-8 space-y-6">
        {/* Profile */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Profile
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage your personal account information.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="text-sm text-[var(--text-secondary)]"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                defaultValue="FinFlow User"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm text-[var(--text-secondary)]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                defaultValue="user@finflow.app"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Customize how FinFlow looks on your device.
          </p>

          <div className="mt-6 max-w-md">
            <label
              htmlFor="theme"
              className="text-sm text-[var(--text-secondary)]"
            >
              Theme
            </label>

            <select
              id="theme"
              value={theme}
              onChange={(event) =>
                setTheme(event.target.value as Theme)
              }
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Preferences
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Customize how FinFlow displays your financial
            information.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="currency"
                className="text-sm text-[var(--text-secondary)]"
              >
                Currency
              </label>

              <select
                id="currency"
                defaultValue="NGN"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-emerald-500"
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
              <label className="text-sm text-[var(--text-secondary)]">
                Notifications
              </label>

              <div className="mt-2 flex h-[46px] items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4">
                <span className="text-sm text-[var(--text-primary)]">
                  Transaction alerts
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications((current) => !current)
                  }
                  aria-label="Toggle notifications"
                  aria-pressed={notifications}
                  className={`relative h-6 w-11 rounded-full transition ${
                    notifications
                      ? "bg-emerald-500"
                      : "bg-[var(--surface-hover)]"
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

              <p className="mt-2 text-xs text-[var(--text-secondary)]">
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
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Security
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage your account security settings.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-[var(--text-primary)]">
                Password
              </p>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Change your account password.
              </p>
            </div>

            <button
              type="button"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--text-secondary)] hover:bg-[var(--surface-hover)] sm:w-auto"
            >
              Change password
            </button>
          </div>
        </section>

        {/* Save */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Preferences are currently stored for this session.
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