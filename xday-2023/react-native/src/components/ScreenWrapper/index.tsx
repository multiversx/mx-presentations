import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './ScreenWrapper.styles';

interface ScreenWrapperProps {
  children?: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  return (
    <SafeAreaView style={styles.screenContainer}>
      {children ? children : null}
    </SafeAreaView>
  );
};
