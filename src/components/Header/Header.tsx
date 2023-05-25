import styles from './Header.module.scss';
import logo from '../../logo.svg'
import { MainButton } from '../MainButton';
import classNames from 'classnames';
import { MutableRefObject } from 'react';
import { scrollTo } from '../../helpers';

interface Props {
  usersRef: MutableRefObject<HTMLDivElement | null>,
  formRef: MutableRefObject<HTMLDivElement | null>,
}

export const Header: React.FC<Props> = ({
  usersRef,
  formRef,
}) => {

  return (
    <header className={classNames(
      styles.header,
      styles.container,
    )}>
      <img
        src={logo}
        alt="TestTask Logo"
        className={styles.header__logo}
      />

      <nav className={styles.header__nav}>
        <div className={styles['header__nav-item']}>
          <MainButton
            onClickHandler={() => scrollTo(usersRef)}
          >
            Users
          </MainButton>
        </div>
        
        <div className={styles['header__nav-item']}>
          <MainButton
            onClickHandler={() => scrollTo(formRef)}
          >
            Sign up
          </MainButton>
        </div>
      </nav>
    </header>
  )
}