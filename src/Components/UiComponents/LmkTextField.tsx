import React from 'react';
import TextField from '@material-ui/core/TextField';

interface props {
  value: string;
  disable?: boolean;
  onTextChange: (value: string) => void;
  label?: string | undefined;
  type?: string;
  placeholder?: string;
}

export default (props: props) => {
  return (
    <TextField
      disabled={props.disable}
      onChange={(e: any) => props.onTextChange(e.target.value)}
      value={props.value}
      label={props.label}
      placeholder={props.placeholder}
      type={props.type}
      fullWidth={true}
    />
  );
};
