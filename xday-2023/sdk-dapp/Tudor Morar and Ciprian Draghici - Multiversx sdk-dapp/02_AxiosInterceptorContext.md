# 2. AxiosInterceptorContext (utility, usage) @TudorMorar

When we build a dApp, our <DappProvider> will most likely be a child of a larger <App> wrapper. Maybe this <App> wrapper will also contain an element that makes network requests which sits aboove the <DappProvider>. This means that the <DappProvider> will not be able to provide the Authorization header to axios, because it is not a parent of it. This is why we need to use the <AxiosInterceptorContext> in order to a higher order component that will provide the Authorization header to axios.

The <AxiosInterceptorContext> has 3 components:
    1. Provider
    2. Listener
    3. Interceptor

The <AxiosInterceptorContext.Provider> is the component that will provide the Authorization header to axios. It has a prop called `authenticatedDomains` which is an array of strings. These strings are the domains that will receive the Authorization header. The <AxiosInterceptorContext.Listener> is the component that will listen for a token signed at login and send it to the <AxiosInterceptorContext> context above. The <AxiosInterceptorContext.Interceptor> is the component that will add the Authorization header to the requests that are made to the domains specified in the `authenticatedDomains` prop.

This is a sample of how the app skeleton should be structured:

```typescript
import { AxiosInterceptorContext } from '@multiversx/sdk-dapp/wrappers/AxiosInterceptorContext';
```

```jsx
<AxiosInterceptorContext.Provider>
  <AxiosInterceptorContext.Interceptor
    authenticatedDomanis={['https://my-api.com']}
  >
    <Router>
      <DappProvider environment={EnvironmentsEnum.devnet}>
        <>
          <AxiosInterceptorContext.Listener />
          {/*
            // other components below
          */}
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals />

          <Routes>...</Routes>
        </>
      </DappProvider>
    </Router>
  </AxiosInterceptorContext.Interceptor>
</AxiosInterceptorContext.Provider>
```

The workflow would be as follows:
- the user logs in and signs a `nativeAuth` token. Here is an example from Ledger login:
```typescript
       const loginInfo = await hwProvider.tokenLogin({
          token: Buffer.from(`${token}{}`),
          addressIndex: index
        });
```
- once the login information is saved in Redux, the <AxiosInterceptorContext.Listener> will push the `nativeAuth` to the <AxiosInterceptorContext> context above
- the axios interceptor will be set by the <AxiosInterceptorContext.Interceptor> component
- the user is redirected to the Dashboard or the main page of the dApp, where all authenticated requests will be made with the bearer token for the desired domains


