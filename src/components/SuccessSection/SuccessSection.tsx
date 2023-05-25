import styles from './SuccessSection.module.scss';
import classNames from 'classnames';
import successImage from '../../success-image.svg';

export const SuccessSection = () => {

  return (
    <section
      id='users'
      className={classNames(
        styles.container,
        styles.section,
      )}
    >
      <h2 className={styles.section__title}>
        User successfully registered
      </h2>

      <div className={styles.success}>
        <img
          className={styles.success__image}
          src={successImage}
          alt="user successfuly created"
        />
      </div>
    </section>
  )
}