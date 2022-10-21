Transfer-frontend
====

This is the frontend project for the transfers backend,
the main purpose of this project is for me to practice
react app development.

## Installation
Install node dependencies
```bash
$ npm i
```
## Settings

- `.env` file is to store the application variables

- all the variables must have prefix `REACT_APP_` to be recognized by React

## Development

### Start a development server

```bash
$ npm start
```

By default the app is running at [http://localhost:3001/](http://localhost:3001/)


### Watch and compile sass files

```bash
$ npm run sass:watch
```

### Build sass for production

```bash
$ npm run sass:build
```

## Test
we use [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

combined with mocking library [MSW](https://mswjs.io/) that uses Service Worker API to intercept actual requests.

Test files are in `__tests__` folders next to the code they are testing so that relative imports appear shorter

### Watch test changes

```bash
$ npm test
```

### Generate test report

```bash
$ npm test -- --coverage
```
(note extra -- in the middle)

## Project structure

```
├── public
│   └── index.html // context for react to render to
├── src
│   ├── app
│   │   ├── store.js // setup store
│   ├── components // shared components
│   ├── feature
│   │   ├── transfers
│   │       ├── create
│   │       ├── delete
│   │       ├── edit
│   │       ├── list
│   │       ├── partials
│   │       ├── slices // reducers and actions to send API requests and manage states
│   ├── sass
│   ├── utils // heplers to reuse across the application
│   └── testUtils // utilities and fake data for running tests
├── index.js // entry points for react components
├── index.css // compiled style sheets
├── .env
```
