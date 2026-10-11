# LedgerLens

A high-performance portfolio dashboard built with React, Vite, TypeScript, and Tailwind CSS. Designed to handle dense financial datasets smoothly without UI lag using DOM virtualisation.

## Features

- **Virtualised Ledger Stream:** Uses TanStack Virtual to render 15,000+ transaction rows while maintaining smooth 60 FPS scrolling and low memory overhead.
- **Holdings Rollup & Cost Basis:** Chronologically parses transaction streams (Buy, Sell, Dividend, Split events) to track net share balances, average cost basis, market value, and unrealised gains/losses across **NZD**, **AUD**, and **USD**.
- **CSV Data Ingestion:** Built-in dropzone file parser with schema validation and a sample template generator to import custom trade files.
- **NZ English Localisation:** Uses New Zealand English spelling conventions throughout the codebase and interface.

---

## Tech Stack

- **Framework:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Data Management:** TanStack Table, TanStack Virtual

---

## Getting Started Locally

To run the project on your local machine:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ledgerlens.git
cd ledgerlens

# Install dependencies
npm install

# Start the development server
npm run dev
```

To create a production build:

```bash
npm run build
```

---

## Disclaimer

edgerLens is a frontend performance engineering and portfolio simulation sandbox. All data is simulated and does not represent real market conditions, corporate actions, or investment advice. This is only a portfolio project.

All data is simulated and does not represent real market conditions, corporate actions, or investment advice.
