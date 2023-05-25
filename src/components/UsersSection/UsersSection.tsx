import styles from './UsersSection.module.scss';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { User } from '../../types/User';
import apiService from '../../services/api';
import { UserCard } from '../UserCard';
import { MainButton } from '../MainButton';
import { Loader } from '../Loader';

const USERS_PER_PAGE = 6;

const defaultUser: User = {
  email: '',
  id: 0,
  name: '',
  phone: '',
  photo: '',
  position: '',
}

const placeholderArray: User[] = Array(USERS_PER_PAGE).fill(defaultUser);

export const UsersSection = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    setIsLoading(true);
    apiService.getUsers(usersPage, USERS_PER_PAGE)
      .then(data => {
        setUsers(data.users);

        if (data.total_pages <= usersPage) {
          setHasNext(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [usersPage]);

  return (
    <section
      id='users'
      className={classNames(
        styles.container,
        styles.section,
      )}
    >
      <h2 className={styles.section__title}>
        Working with GET request
      </h2>

      {isLoading 
        ? (<>
            <Loader />

            <ul className={styles.users__palceholder}>
              {placeholderArray.map(user => (
                <UserCard user={user} />
              ))}
            </ul>
          </>
          )
        : (
          <ul className={styles.users__list}>
            {users.map(user => (
              <li
                key={user.id}
                className={styles.users__item}  
              >
                <UserCard user={user} />
              </li>
            ))}
          </ul>
        )}

        
      <div className={styles['users__show-more']}>
        <MainButton
          onClickHandler={() => setUsersPage(prevPage => prevPage + 1)}
          disabled={!hasNext}
          bigger
        >
          Show more
        </MainButton>
      </div>
    </section>
  )
}