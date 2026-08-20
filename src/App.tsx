import Header from "./components/Header"
import TransactionList from "./components/TransactionList"

function App() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <main className="mx-auto max-w-4xl">
        <Header />
        <TransactionList />
      </main>
    </div>
  )
}

export default App