# CEO Portal Implementation Checklist

This checklist focuses purely on the functionality described in the CEO Portal PRD, separating the business logic and features from the design and UI specifics.

## 1. Authentication & Security
- [ ] Implement Supabase Authentication specifically for the CEO portal.
- [ ] Create CEO role-based access controls (RBAC) to explicitly deny access to employees and standard admins.
- [ ] Enable Multi-Factor Authentication (MFA) as an optional setting for the CEO account.
- [ ] Configure Supabase Row Level Security (RLS) policies so that only the CEO can read/write financial data.
- [ ] Ensure all sensitive financial and performance data points are appropriately encrypted or securely stored.

## 2. Owner Homepage (Main Dashboard)
- [ ] **Total Balance:** Implement logic to aggregate and display the total account balance.
- [ ] **Savings Account:** Create data structures and logic to show a detailed breakdown of savings.
- [ ] **Investment Portfolio:** Build tracking for asset classes and calculate performance metrics.
- [ ] **Wallets Management:** Create CRUD functionality for manually added wallets, including balance updating.
- [ ] **Cash Flow Overview:** Implement calculation for monthly income vs. expenses.
- [ ] **Recent Activities Log:** Build an activity feed that tracks:
  - [ ] Client closures/deals won.
  - [ ] Newly generated or paid invoices.
  - [ ] Log comparing project requirements against charges.

## 3. Analytics Engine
- [ ] Implement metric calculation for **ROI** (Return on Investment).
- [ ] Implement metric calculation for **COGS** (Cost of Goods Sold).
- [ ] Implement metric calculation for **EBITDA** (Earnings Before Interest, Taxes, Depreciation, and Amortization).
- [ ] Build data aggregation for **Revenue Growth** over time.
- [ ] Build data aggregation for **Client Acquisition Trends**.
- [ ] Implement comparison logic for **Employee Cost vs. Revenue** analysis.

## 4. Transactions Ledger
- [ ] Build a database table/schema for recording financial transactions.
- [ ] Display transaction properties: Date, Amount, Type (Income/Expense), and Category.
- [ ] Implement robust filtering logic:
  - [ ] Filter by Date Range.
  - [ ] Filter by Category.
  - [ ] Filter by Client.
- [ ] Implement Export Functionality:
  - [ ] Export transactions to CSV.
  - [ ] Export transactions to PDF.

## 5. Invoicing System
- [ ] Build the database schema for Invoices.
- [ ] Implement the invoice list view with core fields: Number, Client, Date, Amount, Status (Paid/Unpaid).
- [ ] Create a detailed view logic for viewing an individual invoice's breakdown.
- [ ] Track and display the payment history associated with each invoice.

## 6. Forecasting & Advanced Features
- [ ] **Cash Flow Forecast:** Implement an algorithm to project future monthly cash flow based on historical data.
- [ ] **Real-Time ROI:** Implement tracking to calculate ROI specific to individual projects or investments.
- [ ] **Client Growth Tracking:** Implement logic to categorize and track the ratio of new vs. recurring clients.
