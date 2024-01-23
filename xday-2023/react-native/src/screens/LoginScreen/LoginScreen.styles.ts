import { makeStyles } from '@rneui/themed';

export default makeStyles((theme) => ({
  buttonsWrapper: {
    justifyContent: 'space-around',
    flexDirection: 'row'
  },

  mnemonicInput: {
    borderColor: theme.colors?.mint,
    borderWidth: 1,
    padding: 16,
    minHeight: 200,
    maxHeight: 360,
    marginTop: 8,
    backgroundColor: theme.colors?.white
  },
  errorMessage: {
    paddingTop: 8,
    color: 'red'
  }
}));
