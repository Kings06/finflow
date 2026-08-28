import type { Transaction } from "../types/transaction"

export type FinancialInsight = {
  type: "positive" | "warning" | "info"
  title: string
  message: string
}

export function generateFinancialInsights(
  transactions: Transaction[],
): FinancialInsight[] {
  if (transactions.length === 0) {
    return []
  }

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0)

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0)

  const insights: FinancialInsight[] = []

  // Cash flow insight
  if (income > expenses) {
    const net = income - expenses

    insights.push({
      type: "positive",
      title: "Healthy cash flow",
      message: `Your income currently exceeds your expenses by ${formatInsightAmount(net)}.`,
    })
  } else if (expenses > income) {
    const deficit = expenses - income

    insights.push({
      type: "warning",
      title: "Spending is above income",
      message: `Your expenses currently exceed your income by ${formatInsightAmount(deficit)}.`,
    })
  }

  // Expense category analysis
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "expense",
  )

  const categoryTotals = expenseTransactions.reduce<
    Record<string, number>
  >((totals, transaction) => {
    totals[transaction.category] =
      (totals[transaction.category] ?? 0) + transaction.amount

    return totals
  }, {})

  const categoryEntries = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )

  const [topCategory, topCategoryAmount] =
    categoryEntries[0] ?? []

  if (topCategory && expenses > 0) {
    const percentage = Math.round(
      (topCategoryAmount / expenses) * 100,
    )

    insights.push({
      type: "info",
      title: `${topCategory} is your biggest expense`,
      message: `${percentage}% of your recorded expenses are going toward ${topCategory}.`,
    })
  }

  // Large individual expense
  const largestExpense = expenseTransactions.reduce<
    Transaction | undefined
  >((largest, transaction) => {
    if (!largest || transaction.amount > largest.amount) {
      return transaction
    }

    return largest
  }, undefined)

  if (largestExpense && expenses > 0) {
    const percentage = Math.round(
      (largestExpense.amount / expenses) * 100,
    )

    if (percentage >= 25) {
      insights.push({
        type: "warning",
        title: "Large expense detected",
        message: `${largestExpense.description} represents ${percentage}% of your recorded expenses.`,
      })
    }
  }

  // Savings insight
  if (income > 0 && income > expenses) {
    const savingsRate = Math.round(
      ((income - expenses) / income) * 100,
    )

    if (savingsRate >= 20) {
      insights.push({
        type: "positive",
        title: "Strong savings rate",
        message: `You're currently keeping approximately ${savingsRate}% of your recorded income.`,
      })
    }
  }

  return insights.slice(0, 4)
}

function formatInsightAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}