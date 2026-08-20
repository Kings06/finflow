import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Settings,
  Wallet,
} from "lucide-react"

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Transactions",
    icon: CreditCard,
    active: false,
  },
  {
    label: "Analytics",
    icon: BarChart3,
    active: false,
  },
  {
    label: "Accounts",
    icon: Wallet,
    active: false,
  },
]

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-950 p-6 md:block">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold text-slate-950">
          F
        </div>

        <span className="text-xl font-bold">FinFlow</span>
      </div>

      <nav className="mt-10 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                item.active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-8 border-t border-slate-800 pt-6">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white">
          <Settings size={19} />
          Settings
        </button>
      </div>
    </aside>
  )
}

export default Sidebar