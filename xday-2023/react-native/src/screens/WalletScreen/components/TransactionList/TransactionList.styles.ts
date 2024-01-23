import { makeStyles } from '@rneui/themed';

export default makeStyles((theme) => ({
  header: {
    fontSize: 16,
    textAlign: 'center',
    padding: 32,
    backgroundColor: theme.colors?.white
  },
  container: {
    alignItems: 'center',
    marginTop: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors?.fullBlack,
    marginTop: 8
  },
  transactionContainer: {
    marginVertical: 16,
    padding: 16,
    borderColor: theme.colors?.turquoise,
    borderRadius: 16,
    borderWidth: 1
  },
  itemSeparator: {
    height: 1,
    backgroundColor: theme.colors?.gray,
    marginVertical: 16
  }
}));
