import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Menu,
  Settings,
  Wallet,
  X,
} from "lucide-react"
import { NavLink } from "react-router-dom"

type MobileNavProps = {
  isOpen: boolean
  onToggle: () => void
}

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

function MobileNav({ isOpen, onToggle }: MobileNavProps) {
  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950 px-6 py-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-bold text-slate-950 shadow-lg shadow-emerald-500/10">
            F
          </div>

          <div>
            <span className="text-lg font-bold tracking-tight">
              FinFlow
            </span>

            <p className="text-[11px] text-slate-500">
              Personal finance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="rounded-xl p-2 text-slate-300 transition duration-200 hover:bg-slate-800 hover:text-white"
          aria-label={
            isOpen ? "Close navigation" : "Open navigation"
          }
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {isOpen && (
        <div className="border-b border-slate-800/80 bg-slate-950 px-6 py-4 md:hidden">
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={onToggle}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${
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

            <div className="my-3 border-t border-slate-800/80" />

            <NavLink
              to="/settings"
              onClick={onToggle}
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
          </nav>
        </div>
      )}
    </>
  )
}

export default MobileNav