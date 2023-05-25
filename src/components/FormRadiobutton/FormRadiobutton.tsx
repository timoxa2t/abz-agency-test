import { ChangeEvent } from 'react';
import styles from './FormRadiobutton.module.scss';

interface Props {
  id: string,
  name: string,
  value: string,
  checked: boolean,
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

export const FormRadiobutton: React.FC<Props> = ({
  id,
  name,
  value,
  checked,
  handleChange
}) => {

  return (
    <div className={styles['radio']}>
      <input
        className={styles['radio__input']}
        id={id}
        type='radio'
        name={name}
        value={value}
        onChange={handleChange}
        checked={checked}
      />

      <label
        className={styles['radio__label']}
        htmlFor={id}
      >
        {value}
      </label>
    </div>
  )
}