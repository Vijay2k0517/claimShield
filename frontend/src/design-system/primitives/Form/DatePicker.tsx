import { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { Input, InputProps } from './Input';
import './Form.css';

export interface DatePickerProps extends Omit<InputProps, 'type' | 'leftIcon'> {}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {
  return (
    <Input
      ref={ref}
      type="date"
      leftIcon={<Calendar size={15} />}
      {...props}
    />
  );
});

DatePicker.displayName = 'DatePicker';
