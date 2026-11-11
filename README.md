# Abra Food Delivery System

This repository contains a lightweight food delivery ordering system MVP built with plain HTML, CSS, and JavaScript.

## Features

- Menu with item cards
- Cart with quantity controls
- Checkout form for customer details
- Order list with status updates
- Local browser storage so orders and cart persist across refreshes

## Run locally

### Option 1: Open directly
Open `index.html` in your browser.

### Option 2: Use a local web server
From the project folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project structure

- `index.html` — app layout
- `styles.css` — design and responsive layout
- `app.js` — menu logic, cart behavior, and order processing

## Next upgrades

- Add a real backend with Node.js or Firebase
- Add user login for admin management
- Connect to Stripe or PayPal for payments
- Add restaurant dashboard for tracking live orders
- Add menu management for adding/removing dishes
