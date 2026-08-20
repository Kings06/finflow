function Accounts() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Accounts
      </h1>

      <p className="mt-2 text-slate-400">
        Manage your connected accounts.
      </p>

      <div className="mt-8 rounded-2xl bg-slate-900 p-6">
        <p className="text-slate-400">
          No accounts connected yet.
        </p>
      </div>
    </div>
  )
}

export default Accounts