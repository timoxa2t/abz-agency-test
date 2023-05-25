import { ChangeEvent, useState } from 'react';
import styles from './FormInput.module.scss';
import classNames from 'classnames';

interface Props {
  id: string,
  name: string,
  type: 'text' | 'email'
  value: string,
  label: string,
  helper: string,
  setter: (newValue: string) => void,
  validationError: string, 
}

export const FormInput: React.FC<Props> = ({
  id,
  name,
  type,
  value,
  setter,
  label,
  helper,
  validationError,
}) => {

  const isError = !!validationError;

  const handleVaueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setter(newValue);
  }

  return (
    <div className={classNames(
      styles.field,
      {
        [styles['field--error']]: isError,
      },
    )}>
      <input
        id={id}
        className={styles.field__input}
        onChange={handleVaueChange}
        value={value}
        type={type}
        name={name}
        placeholder={label}
      />
      
      {!value || (
        <label
          htmlFor='name'
          className={styles.field__label}
        >
          {label}
        </label>
      )}
      

      <p
        className={styles['field__input-helper']}
      >
        {validationError ? validationError : helper}
      </p>
    </div>
  )
}