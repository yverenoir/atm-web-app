# ATM web app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

These additional frameworks and libraries are used:

- Material UI for styling
- React Router for routing

## How to run app

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Dispensing mechanism

This section describes the approach and algorithm used to dispense the requested amount.

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
- d) Dispense the minimal number of notes. (Coin change problem)
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

The balance returned via the API is static. I assume after each withdraw, the web app has to persist the new balance.
The web app uses a workaround (via the states of the router) to pass around the balance
after each withdraw.

### ATM behavior

I assume this web app is to mimic an ATM's behavior. The web app does not have the sensor input as a real ATM. This web
app assumes the user inserts their card at the beginning of the flow and collects the card from the ATM at the end of
the flow. This behavior is visually accompanied by two screens with timer set on them to trigger the next step of the
flow.

## Tests

To run all tests, run:

### `npm test`

The tests focus on unit and integration testing the core business logic, dispensing the requested amount in with evenly
distributed denominations.

Some of the tests are parametrised tested, meaning more than one input and result tuple are used as input values for one
test case.

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

### Loading states

The app does not disable user interactions when in loading state (authenticating via pin, requesting withdraw). This can
lead to idempotency issues or duplicated actions being executed. This is also bad UX because the user has no indication
if the request has been registered with the web app successfully.