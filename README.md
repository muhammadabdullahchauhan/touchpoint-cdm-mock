# TouchPoint CDM Mock

A front-end only simulation of a **Cash Deposit Machine (CDM)** kiosk flow built with **Angular**. It recreates a real self-service banking experience with mock data and no backend.

## Flow

Home → Enter CNIC → Account Details → Cash Deposit → Summary

1. **Home:** Kiosk home screen with the Cash Deposit service card.
2. **Enter CNIC:** 13-digit CNIC entry using an on-screen ATM keypad.
3. **Account Details:** Account number, mobile number, amount and purpose of transaction.
4. **Cash Deposit:** Review details, simulate cash insertion, notes counted, add more cash, and amount mismatch confirmation.
5. **Summary:** Transaction result with receipt options.

## Features

- ATM-style on-screen keypad
- 4-step progress stepper with completion ticks
- Real-world style validations (CNIC, account, mobile, amount in multiples of 10, limits)
- Amount mismatch popup (Cancel / Proceed)
- Inactivity timeout with countdown
- Route guards to prevent skipping steps
- Mock API service with simulated delays
- Responsive kiosk layout (portrait kiosk and landscape laptop)

## Tech Stack

- Angular (standalone components, signals)
- TypeScript
- SCSS
- Angular Router and Reactive Forms

## Project Structure

```
src/app/
├── pages/            home, cnic, account-details, cash-deposit, summary
├── shared/components keypad, stepper, modal, logo, button bar
├── services/         transaction, mock-api, session
├── guards/
├── validators/
├── mock-data/
└── app.constants.ts
```

## Getting Started

```bash
git clone https://github.com/<your-username>/touchpoint-cdm-mock.git
cd touchpoint-cdm-mock
npm install
ng serve
```

Open `http://localhost:4200`.

## Notes

- All data is mock data. No real banking or personal information is used.
- Data is kept in memory only and is cleared when the session ends.

## Author

**Muhammad Abdullah Chauhan**
Frontend / MERN Stack Developer
Portfolio: https://abdullah-portfolio-eight-rho.vercel.app/
