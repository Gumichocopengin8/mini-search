import { InputAdornment, IconButton, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  placeholder: string;
  register: UseFormRegisterReturn;
}

const MainInputField = ({ register, placeholder }: Props) => {
  return (
    <OutlinedInput
      {...register}
      key="MainInputField"
      type="search"
      placeholder={`Search on ${placeholder}`}
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
  );
};

export default MainInputField;
