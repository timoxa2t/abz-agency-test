import styles from './HomeBanner.module.scss';
import { MainButton } from '../MainButton';
import classNames from 'classnames';
import { scrollTo } from '../../helpers';
import { MutableRefObject } from 'react';

interface Props {
  formRef: MutableRefObject<HTMLDivElement | null>,
}

export const HomeBanner: React.FC<Props> = ({ formRef }) => {
  return (
    <section className={classNames(
      styles.container,
      styles.banner,
    )}>
      <div className={styles.banner__content}>
        <h2 className={styles.banner__title}>
          Test assignment for front-end developer
        </h2>

        <p className={styles.banner__text}>
          What defines a good front-end developer is one that has skilled knowledge of HTML, CSS, JS with a vast understanding of User design thinking as they'll be building web interfaces with accessibility in mind. They should also be excited to learn, as the world of Front-End Development keeps evolving.
        </p>

        <MainButton
          onClickHandler={() => scrollTo(formRef)}
        >
          Sign up
        </MainButton>
      </div>
    </section>
  )
}