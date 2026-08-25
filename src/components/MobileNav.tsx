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
      <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-6 py-4 transition-colors duration-200 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-bold text-slate-950 shadow-lg shadow-emerald-500/10">
            F
          </div>

          <div>
            <span className="text-lg font-bold tracking-tight">
              FinFlow
            </span>

            <p className="text-[11px] text-[var(--text-secondary)]">
              Personal finance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          aria-label={
            isOpen ? "Close navigation" : "Open navigation"
          }
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {isOpen && (
        <div className="border-b border-[var(--border)] bg-[var(--background)] px-6 py-4 transition-colors duration-200 md:hidden">
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
                       ? "bg-[var(--surface-hover)] text-[var(--text-primary)]"
  : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
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

            <div className="my-3 border-t border-[var(--border)]" />

            <NavLink
              to="/settings"
              onClick={onToggle}
              className={({ isActive }) =>
                `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition duration-200 ${
                  isActive
                   ? "bg-[var(--surface-hover)] text-[var(--text-primary)]"
  : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
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