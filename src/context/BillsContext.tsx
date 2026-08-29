import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Bill } from "../types/bill"

type BillsContextValue = {
  bills: Bill[]
  addBill: (bill: Omit<Bill, "id">) => void
  editBill: (id: number, bill: Omit<Bill, "id">) => void
  removeBill: (id: number) => void
}

const BillsContext =
  createContext<BillsContextValue | null>(null)

const STORAGE_KEY = "finflow-bills"

function BillsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [bills, setBills] = useState<Bill[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return []
    }

    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bills),
    )
  }, [bills])

  const addBill = useCallback(
    (bill: Omit<Bill, "id">) => {
      setBills((current) => {
        const newBill: Bill = {
          ...bill,
          id: Date.now(),
        }

        return [...current, newBill]
      })
    },
    [],
  )

  const editBill = useCallback(
    (
      id: number,
      bill: Omit<Bill, "id">,
    ) => {
      setBills((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...bill,
                id,
              }
            : item,
        ),
      )
    },
    [],
  )

  const removeBill = useCallback((id: number) => {
    setBills((current) =>
      current.filter((item) => item.id !== id),
    )
  }, [])

  const value = useMemo(
    () => ({
      bills,
      addBill,
      editBill,
      removeBill,
    }),
    [bills, addBill, editBill, removeBill],
  )

  return (
    <BillsContext.Provider value={value}>
      {children}
    </BillsContext.Provider>
  )
}

export function useBillsContext() {
  const context = useContext(BillsContext)

  if (!context) {
    throw new Error(
      "useBillsContext must be used inside BillsProvider",
    )
  }

  return context
}

export default BillsProvider