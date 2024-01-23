import { NavigationStackParamsList } from 'navigation/stackParamsList';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends NavigationStackParamsList {}
  }
}
