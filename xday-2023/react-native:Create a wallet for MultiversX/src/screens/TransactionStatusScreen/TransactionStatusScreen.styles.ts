import { makeStyles } from '@rneui/themed';

export default makeStyles((theme) => ({
  checkMark: {
    fontSize: 40,
    textAlign: 'center',
    margin: 16
  },
  wrapper: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  rowWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8
  },
  amount: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700'
  },
  label: {
    marginVertical: 8,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors?.turquoise,
    textAlign: 'center'
  },
  value: {
    fontSize: 16,
    textAlign: 'center'
  }
}));
