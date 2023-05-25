import styles from './Loader.module.scss';
import classNames from 'classnames';

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loader__spinner}/>
    </div>
  )
}