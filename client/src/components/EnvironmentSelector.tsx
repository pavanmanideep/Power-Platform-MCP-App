import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { Environment } from '../types';

export function EnvironmentSelector({ environments, value, onChange }: { environments: Environment[]; value: string; onChange: (value: string) => void }) {
  return (
    <FormControl fullWidth>
      <InputLabel id="environment-select-label">Environment</InputLabel>
      <Select
        labelId="environment-select-label"
        label="Environment"
        value={value}
        onChange={(event) => onChange(String(event.target.value))}
      >
        {environments.map((environment) => (
          <MenuItem key={environment.id} value={environment.id}>
            {environment.name} ({environment.type})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
