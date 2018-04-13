Run the following to install the necessary apps:
```
npm install frisby jest json-server faker --save-dev
```

The frisby tests are executed against a local server.
This will be running at http://localhost:3000/customers

Start Json Server with:
```
npm run mock
```

Run the tests with: 
```
npm run test
```