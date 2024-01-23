import { makeStyles } from '@rneui/themed';

export default makeStyles((theme) => ({
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors?.turquoise,
    textAlign: 'center',
    marginBottom: 16
  },
  value: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 16
  }
}));
