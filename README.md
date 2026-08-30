# FinFlow 💰

### A modern personal finance dashboard built with React, TypeScript, and Tailwind CSS.

FinFlow is a personal finance management dashboard designed to help users understand and manage their financial activity through accounts, transactions, bills, analytics, insights, and financial forecasting.

The project focuses on building a realistic frontend application with reusable components, structured application state, API integration, data visualization, responsive layouts, and type-safe development.

---

## ✨ Features

### 📊 Financial Dashboard

- Overview of financial activity
- Income and expense summaries
- Financial status indicators
- Spending insights
- Safe-to-spend information
- Cash flow forecasting

### 💳 Transaction Management

- View transactions
- Add transactions
- View transaction details
- Organize transaction data
- Transaction-based financial summaries

### 🏦 Account Management

- View financial accounts
- Add new accounts
- Edit account information
- View individual account details
- Manage account-related data

### 📅 Bills & Recurring Expenses

- Track bills
- Manage recurring expenses
- Monitor upcoming financial obligations

### 📈 Analytics & Insights

- Financial charts and visualizations
- Spending breakdowns
- Financial insights
- Cash flow analysis
- Forecasting

### ⚙️ User Preferences

- Application settings
- Theme preferences
- Responsive navigation
- Mobile-friendly interface

---

## 🛠️ Tech Stack

### Frontend

- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Recharts**
- **Lucide React**

### Data & API

- **Axios**
- REST API integration
- Data transformation utilities

### Development Tools

- **Vite**
- **ESLint**
- **Git**
- **GitHub**

---

## 🏗️ Project Structure

```text
src/
├── api/
│   ├── client.ts
│   ├── posts.ts
│   ├── transactions.ts
│   └── transformers.ts
│
├── components/
│   ├── CashFlowForecast.tsx
│   ├── FinancialChart.tsx
│   ├── FinancialInsights.tsx
│   ├── FinancialSummary.tsx
│   ├── Header.tsx
│   ├── MobileNav.tsx
│   ├── RecurringExpenses.tsx
│   ├── SafeToSpendCard.tsx
│   ├── Sidebar.tsx
│   ├── SpendingInsights.tsx
│   ├── SummaryCards.tsx
│   ├── TransactionItem.tsx
│   └── TransactionList.tsx
│
├── context/
│   ├── AccountsContext.tsx
│   ├── BillsContext.tsx
│   ├── PreferencesContext.tsx
│   ├── ThemeContext.tsx
│   ├── TransactionsContext.tsx
│   └── TransactionsProvider.tsx
│
├── pages/
│   ├── AccountDetails.tsx
│   ├── Accounts.tsx
│   ├── AddAccount.tsx
│   ├── AddTransaction.tsx
│   ├── Analytics.tsx
│   ├── Bills.tsx
│   ├── Dashboard.tsx
│   ├── EditAccount.tsx
│   ├── Settings.tsx
│   ├── TransactionDetails.tsx
│   └── Transactions.tsx
│
├── types/
│   ├── account.ts
│   ├── api.ts
│   ├── bill.ts
│   └── transaction.ts
│
└── utils/
    ├── cashFlow.ts
    ├── chart.ts
    ├── currency.ts
    ├── expenseBreakdown.ts
    ├── financial.ts
    ├── financialStatus.ts
    ├── forecast.ts
    ├── insights.ts
    ├── recurring.ts
    ├── safeToSpend.ts
    └── transactions.ts