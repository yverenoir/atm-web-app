# ATM web app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to run app

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Dispensing mechanism

In real life, ATMs have different ways of prioritising what denominations should be dispensed.

Some prioritisation strategies are:

- a) Dispense big denominations. Benefit would be that small amounts (e.g. 5$) are more likely to be dispensable down
  the line.
- b) Dispense all denominations available. Shortcoming would be small amounts (e.g. 5$) are less
  likely
  to be dispensable for customers coming at a later time.
- c) Dispense evenly according to machine's cash balance, e.g. when there's more 10$ notes than 20$ notes in the ATM,
  dispense more of 10$.
  This approach ensures the ATM always has the most balanced denominations for all customers.
- d) Dispense the minimal number of notes.
- e) ...

The ask for this web app was to dispense a "roughly even mix of notes". To satisfy this requirement, strategy b) would
be suitable. However, this would come with the shortcoming that smaller amounts are less likely to be dispensable when
the ATM's cash is low.

To overcome this shortcoming, the business logic implemented in the repo is a combination of b) and c).

The algorithm for calculating the denominations for a requested amount takes 3 steps:

1. Find out all possible combinations that can satisfy the requested amount using the available denominations in ATM.
2. Out of all combinations from 1, find out all combinations which use the most variety of denominations.
3. Out of all combinations from 2, find out one combination which comes the closest to the distribution of denomination
   in the ATM.

## Assumptions

### Physical limitation of the ATM machine

The business logic does not consider the physical limitation of the ATM machine. E.g. maximum number of notes can be
dispensed in a single transaction.

### Current balance via API

TBD

## Tests

To run all tests, run:

### `npm test`

The tests focus on unit and integration testing the core business logic, dispensing the requested amount in with evenly
distributed denominations.

## Browser compatibility

This application was tested on Chrome v113.x.

## Further thinking

### Auth and path protection

At the moment there's no auth state persistence nor is path protection. The auth state should be persisted throughout
the session. This can be achieved by implementing a protocol like OAuth. AuthGuards should be introduced for all paths.

### Messages and content

At the moment most of the texts for buttons and messages are sitting in the source code. It is
hard to
find and maintain, also for the purpose of localisation, all content should be extracted.

### E2E test

The FE features were manually tested. An E2E test with cypress or playwright to test the entire flow from
inserting the card to exiting transaction incl. edge cases (e.g. overdraft, insufficient fund in vault) will be
needed.

### Responsiveness

The app is optimised for desktop usage. As it is a simulation of a physical ATM machine, mobile
responsiveness was not prioritised. For a real customer facing banking web app, mobile responsiveness should be the
first priority.