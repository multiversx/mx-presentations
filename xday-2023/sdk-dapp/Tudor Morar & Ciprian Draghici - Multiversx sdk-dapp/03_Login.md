3. Login flow

Before talking about logging in, we should clarify what exactly logging in means, since we are developing a front-end app that has no backend. 
We consider a user account as a public-private key pair. The public key is used to query the blockchain for information about the account, and the private key is used to sign transactions.
This public-private key pair is stored in what we call an account provider. The account provider can be a hardware wallet, a browser extension, a mobile wallet, or a web wallet. In the future, we will also support other types of account providers, but this is beyond the scope of this presentation. Currently, sdk-dapp makes it easy to integrate with:
- Ledger
- DeFi Wallet extension
- xPortal mobile wallet
- MultiversX Web Wallet (The MultiversX Web Wallet supports all three methods listed above 
plus keystore JSON file login and PEM file login)

Each of these login methods have their own caveats and `@multiversx/sdk-dapp` makes it easy to handle them. What `@multiversx/sdk-dapp` does is that it provides an unified interface for all of these login methods. This unified interface is made up of a visual component (a login button) and a React hook that encapsulates the specific login logic. 

Before diving into the details, we need to understand the concept of a wallet. A wallet is a collection of accounts. A user can have multiple accounts derived from a mnemonic phrase, and each account has a public-private key pair. For example, a user can have a Ledger wallet with multiple accounts, or a DeFi Wallet extension with multiple accounts. 

In order to use some APIs, at login, the user needs to also sign a loginToken. So the login is completed once the dApp receives three elements: the public key, the loginToken, and the signature of the loginToken. The last two elements are being used by the nativeAuth package to formulate a nativeAuth token that will be used as a bearer token for the APIs that require authentication. Note that the token allows a single website origin to use the API for a desired period of time (ex: 24 hours). After the token expires, the user needs to login again.

Available login buttons are:
- ExtensionLoginButton
- WalletConnectLoginButton
- LedgerLoginButton
- WebWalletLoginButton

The buttons accept a series of common props,

```jsx
  callbackRoute?: string; // where to redirect after login
  token?: string; // the token to use for authentication
  /**
   * If specified, `onLoginRedirect` will overwrite callbackRoute default navigation
   */
  onLoginRedirect?: OnLoginRedirectType;
  /**
   * If set to `true`, will fallback on default configuration
   */
  nativeAuth?: NativeAuthConfigType | boolean; // customize native auth timeout for example
```

...and some specific props. In the case of ExtensionLoginButton's props these are:

```jsx
  children?: ReactNode;
  buttonClassName?: string;
  loginButtonText?: string;
  disabled?: boolean;
```

So you can use the button like this:

```jsx
<ExtensionLoginButton
  callbackRoute="/dashboard"
  buttonClassName="extension-login"
  loginButtonText="Extension login"
>
  <>
    <icon/>
    <p>Login text</p>
  <>
</ExtensionLoginButton>
```

If you need to implement your own button, you can use the `useExtensionLogin` hook. This hook returns a function that you can call to start the login process. The hook accepts the same props as the button, except for the children prop. 

Each type of login has its own specific way of handling the login process, meaning that both Ledger and xPortal open a modal, the DeFi wallet opens the extension's popup window, while the Web Wallet redirects to a login page. 

Once the login process is completed, the data is persisted in localStorage. Sdk-dapp exposes a component called AuthenticatedRoutesWrapper, which can be used to protect certain routes and redirect the user to login page if the user is not authenticated.

Import from sdk-dapp:

```typescript
import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper';
or;
import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers';
```

Use with routes:

```jsx
<AuthenticatedRoutesWrapper routes={routes} unlockRoute='/unlock'>
  {appContent}
</AuthenticatedRoutesWrapper>
```

**routes** should be an array with objects with a signature similar to this:

```typescript
{
    path: "/dashboard",
    title: "Dashboard",
    component: Dashboard,
    authenticatedRoute: true,
  }
```

Some extra notes about logging in would be:
- in case of Ledger login, the app needs to be served over https
- both Ledger and Keystore support multiple indexes for a single mnemonic phrase, and this support will be later extended to the DeFi Wallet
- in case of Web Wallet login, the callbackUrl should be encoded with `encodeUriComponent` and must have the same origin as the dApp
- in case of xPortal ( WalletConnect ) Login, a walletConnectV2ProjectId must be provided in the customNetworkConfig, in the DappProvider wrapper. The ProjectId can be generated for free at https://cloud.walletconnect.com/sign-in


