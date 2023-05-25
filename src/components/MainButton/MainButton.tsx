import { PropsWithChildren } from 'react';
import styles from './MainButton.module.scss';
import classNames from 'classnames';

type ButtonType = 'button' | 'submit' | 'reset' | undefined;

interface Props {
  onClickHandler?: () => void;
  type?: ButtonType
  bigger?: boolean; 
  disabled?: boolean;
  hidden?: boolean;
}

export const MainButton:React.FC<PropsWithChildren<Props>> = ({
  onClickHandler = () => {},
  type = 'button',
  bigger = false,
  disabled = false,
  hidden = false,
  children,
}) => {
  return (
    <button
      type={type}
      className={classNames(
        styles.button,
        { [styles['button--bigger']]: bigger }
      )}
      onClick={onClickHandler}
      disabled={disabled}
      hidden={hidden}
    >
      {children}
    </button>
  )
}