4. Logout flow

Same as logging in, logout means removing from sdk-dapp's redux store all the information stored about the account, like public key, nonce, transactions etc., and cancelling the pairing that was done beween the dApp and the account provider.

To do so, the library exposes a simple function called **logout**. 

The function accepts 3 arguments:

- `callbackUrl: string (optional)` the url to redirect the user to after logging him out
- `onRedirect: (callbackUrl: string) => void (optional)` a function that will be called instead of redirecting the user.
  This allows you to control how the redirect is done, for example, with `react-router-dom`, instead of the `window.location.href` assignment.
  _Important_ to know that this function will not be called for web wallet logout
- `shouldAttemptRelogin` is the last (optional) parameter that should only be used if you are developing your own account provider and need to perform custom login logic

There are some cases in which the logout function will be triggered automatically, namely when the nativeAuth token expires, or if you opted-in for using the `useIdleTimer` hook, which logs out the user after a period of inactivity (default set to 10 minutes). Optionally it accepts an `onLogout` function that fulfills your dApp's specific logout business logic. Make sure to call the above `logout` function inside this `onLogout` callback.

This auto-logout feature can be controlled with an optional `logoutRoute` prop, which is a route to redirect after auto-logout.

```typescript
{
  logoutRoute?: string;  // a route to redirect after auto-logout (session expired, native auth token expired or idle app)
}
```
  