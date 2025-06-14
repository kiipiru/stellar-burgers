import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={clsx(styles.link, {
              [styles.link_active]: location.pathname === '/'
            })}
          >
            <BurgerIcon
              type={location.pathname === '/' ? 'primary' : 'secondary'}
              className={styles.logo}
            />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>

          <Link
            to='/feed'
            className={clsx(styles.link, {
              [styles.link_active]: location.pathname === '/feed'
            })}
          >
            <ListIcon
              type={location.pathname === '/feed' ? 'primary' : 'secondary'}
              className={styles.logo}
            />
            <p className='text text_type_main-default ml-2 mr-10'>
              Лента заказов
            </p>
          </Link>
        </div>

        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>

        <div className={styles.link_position_last}>
          <Link
            to='/profile'
            className={clsx(styles.link, {
              [styles.link_active]: location.pathname === '/profile'
            })}
          >
            <ProfileIcon
              type={location.pathname === '/profile' ? 'primary' : 'secondary'}
              className={styles.logo}
            />
            <p className='text text_type_main-default ml-2 mr-10'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
