import { Snackbar, Alert } from '@mui/material';

interface Props {
  isError: boolean;
  onCloseError: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

const ErrorStackbar = ({ isError, onCloseError }: Props) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={isError}
      autoHideDuration={4000}
      onClose={onCloseError}
    >
      <Alert onClose={onCloseError} variant="filled" severity="error" sx={{ width: '100%' }}>
        Data fetch error
      </Alert>
    </Snackbar>
  );
};

export default ErrorStackbar;
