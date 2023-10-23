import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';
import { BASE_URL } from '@constants/index';

export const ApiNetworkProviderSingleton = (() => {
  let instance: ApiNetworkProvider; // Change 'any' to the appropriate type of your instance

  const getInstance = (): ApiNetworkProvider => {
    if (!instance) {
      instance = new ApiNetworkProvider(BASE_URL);
    }
    return instance;
  };

  return { getInstance };
})();
