function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Settings
      </h1>

      <p className="mt-2 text-slate-400">
        Manage your FinFlow preferences.
      </p>

      <div className="mt-8 space-y-6">
        <section className="rounded-2xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Profile
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your personal account information.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-400">
                Name
              </label>

              <input
                type="text"
                defaultValue="FinFlow User"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">
                Email
              </label>

              <input
                type="email"
                defaultValue="user@finflow.app"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Preferences
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Customize how FinFlow displays your financial
            information.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-400">
                Currency
              </label>

              <select
                defaultValue="NGN"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500"
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
              <label className="text-sm text-slate-400">
                Notifications
              </label>

              <select
                defaultValue="enabled"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500"
              >
                <option value="enabled">
                  Enabled
                </option>

                <option value="disabled">
                  Disabled
                </option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Security
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your account security settings.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">
                Password
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Change your account password.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium transition hover:border-slate-500 hover:bg-slate-800"
            >
              Change password
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Settings