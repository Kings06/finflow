import { transactions } from "../data/transactions"

function SummaryCards() {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0)

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0)

  const totalBalance = totalIncome - totalExpenses

  const cards = [
    {
      title: "Total Balance",
      amount: totalBalance,
      description: "Available balance",
    },
    {
      title: "Total Income",
      amount: totalIncome,
      description: "Money received",
    },
    {
      title: "Total Expenses",
      amount: totalExpenses,
      description: "Money spent",
    },
  ]

  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl bg-slate-900 p-6"
        >
          <p className="text-sm text-slate-400">
            {card.title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            ₦{card.amount.toLocaleString()}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {card.description}
          </p>
        </div>
      ))}
    </section>
  )
}

export default SummaryCards