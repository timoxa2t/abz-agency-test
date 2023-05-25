import styles from './UserCard.module.scss';
import classNames from 'classnames';
import { User } from '../../types/User';
import { ChangeEvent } from 'react';
import placeholder from '../../photo_placeholder.svg'

interface Props {
  user: User;
}

export const UserCard: React.FC<Props> = ({
  user
}) => {
  const {
    name,
    email,
    phone,
    position,
    photo,
  } = user;

  const addDefaultSrc = (event: ChangeEvent<HTMLImageElement>) => {
    event.target.src = placeholder;
  }

  return (
    <div className={classNames(
      styles.card,
    )}>
      <img
        onError={addDefaultSrc}
        src={photo}
        className={styles.card__photo}
        alt='User avatar'
      />

      <p className={styles.card__name}>
        {name}
      </p>

      <p className={styles.card__details}>
        {position}
      </p>

      <a
        href={`mailto:${email}`}
        className={styles.card__details}
      >
        {email}
      </a>

      <a
        href={`tel:${phone}`}
        className={styles.card__details}
      >
        {phone}
      </a>
    </div>
  )
}