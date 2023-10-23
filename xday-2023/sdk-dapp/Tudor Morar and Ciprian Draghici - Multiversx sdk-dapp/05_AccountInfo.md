5. Account info

There are several key elements that define a user account. 
- `address`: the public key of the account
- `nonce`: a counter that is incremented every time a transaction is sent from the account
- `balance`: the amount of EGLD tokens that the account has
- `shard`: the shard where the account is located
- `username`: an optional herotag associated with the account

All of the main MultiversX networks (`mainnet`/`devnet`/`testnet`) support notifying dApps through websockets about changes in the account state. To use this feature sdk-dapp offers a hook called `useRegisterWebsocketListener`. The hooks accepts callbacks which will get fired once a websocket message is received, receiving the `string` argument provided by the event. Optionally you can simply listen to changes on account/transactions with the `useGetWebsocketEvent` hook.

Note that it's your responsibility to query specific endpoints after the websocket event is received. For example, if you interact with ESDT tokens, make sure to query the `/accounts/address/tokens` after receiving a websocket event.

There are 2 ways of reading the user current state: hooks (to be used inside components and for reacting to changes in the data) and simple functions (for reading data outside of React components or inside handlers).

- hooks: `useGetLoginInfo, useGetAccountInfo, useGetNetworkConfig, useGetWebsocketEvent`;
- functions: `getAccount, getAccountBalance, getAccountShard, getAddress, getIsLoggedIn, refreshAccount;`

While specific account data is offered by the `useGetAccountInfo` hook, the `useGetLoginInfo` hook offers additional information regarding the login method and signed token (if it exists). This is important since you may want to handle different actions depending on the specified account provider (check out LoginMethodsEnum). One example would be displaying a different loader while waiting for the ledger signature.

The `useGetNetworkConfig` hook offers the current network configuration, which is useful for displaying the network name or chain ID.

As a final note, if you send transactions asynchronously, you may want to refresh the account data after the transaction is sent. This is to prevent mismatches between the local nonce and the account nonce on the API. To do this, simply call the `refreshAccount` function.

