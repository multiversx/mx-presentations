import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';
import { BASE_URL } from 'constants/network';

export const ApiNetworkProviderSingleton = (() => {
  let instance: ApiNetworkProvider;

  const getInstance = (): ApiNetworkProvider => {
    if (!instance) {
      instance = new ApiNetworkProvider(BASE_URL);
    }
    return instance;
  };

  return { getInstance };
})();
