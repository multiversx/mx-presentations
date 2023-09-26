import { makeStyles } from '@rneui/themed';

export default makeStyles((theme) => ({
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors?.turquoise,
    marginBottom: 16,
    marginTop: 24
  },
  contentWrapper: { flex: 1, justifyContent: 'space-between' },
  input: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderColor: theme.colors?.gray,
    borderWidth: 1,
    borderRadius: 8
  },

  buttonWrapper: {
    alignItems: 'center'
  },
  errorMessage: {
    color: 'red'
  }
}));
