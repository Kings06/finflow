import { NavLink } from "react-router-dom"
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
    path: "/",
  },
  {
    label: "Transactions",
    icon: CreditCard,
    path: "/transactions",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    label: "Accounts",
    icon: Wallet,
    path: "/accounts",
  },
]

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-800/80 bg-slate-950 px-5 py-6 md:block">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold text-slate-950 shadow-lg shadow-emerald-500/10">
          F
        </div>

        <div>
          <span className="text-xl font-bold tracking-tight">
            FinFlow
          </span>

          <p className="text-xs text-slate-500">
            Personal finance
          </p>
        </div>
      </div>

      <nav className="mt-10 space-y-1.5">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon
                size={19}
                className="transition duration-200 group-hover:scale-105"
              />

              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-8 border-t border-slate-800/80 pt-6">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition duration-200 ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`
          }
        >
          <Settings
            size={19}
            className="transition duration-200 group-hover:rotate-12"
          />

          Settings
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar