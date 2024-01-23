import { StyleSheet } from 'react-native';
import { palette } from 'designSystem/colors';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: palette.white,
    alignItems: 'stretch',
    justifyContent: 'space-between'
  }
});
