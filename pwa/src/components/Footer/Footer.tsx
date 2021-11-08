import React from 'react';
// import Link from 'react-router-dom';
import styles from './Footer.scss';

export const Footer = (): React.ReactElement => (
  <>
    <div className={styles.Container}>
      <a href="https://it.spbu.ru/" className={styles.Container__text}>
        Управление-служба информационных технологий
      </a>
      <a href="https://spbu.ru/" className={styles.Container__text}>
        Санкт-Петербургский государственный университет<span>, 2020 </span>
      </a>
    </div>
  </>
);
