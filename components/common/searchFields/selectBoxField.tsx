import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MenuItem, InputLabel } from '@mui/material';

interface Props {
  label: string;
  value: string;
  keywords: { name: string; value: string }[];
  onChangeValue: (e: SelectChangeEvent) => void;
}

const SelectBoxField = ({ label, value, keywords, onChangeValue }: Props) => {
  return (
    <>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChangeValue}
        style={{ marginBottom: '1rem' }}
        label={label}
        size="small"
        defaultValue={keywords[0].value}
      >
        {keywords.map((keyword) => (
          <MenuItem key={keyword.value} value={keyword.value}>
            {keyword.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectBoxField;
