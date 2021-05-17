# Moucoin Contract

## install
`npm install`
`npm install -g truffle`

We advise to use use Ganache for testing

## configure
To go on testnet, you need to add a file called `secrets.json` in this folder. It should contain the following:
```json
{
    "mnemonic": "your list of words",
    "projectId": "Your infura project id"
}
```

## How to use
- you can build it: `truffle build`
- Then you can deploy it:
    - either locally: `truffle migrate`
    - or on Ropsten: `truffle migrate --network ropsten` 


## Interaction
You can play with it using the truffle console: `truffle console`. Exmaple:
```javascript
let moucoin = await Moucoin.deployed()
moucoin.balances(accounts[0])
```
