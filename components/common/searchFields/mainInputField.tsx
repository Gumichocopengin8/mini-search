import { FormControl, InputAdornment, IconButton, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useForm } from 'react-hook-form';

type FormData = {
  inputValue: string;
};

const MainInputField = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = ({ inputValue }: FormData) => {
    console.log(inputValue);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl size="small" variant="outlined" fullWidth>
        <OutlinedInput
          {...register('inputValue', { required: true })}
          type="search"
          placeholder="Search"
          defaultValue=""
          autoComplete="off"
          autoFocus
          style={{ marginBottom: '1rem' }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton type="submit" edge="end" size="large">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </form>
  );
};

export default MainInputField;
