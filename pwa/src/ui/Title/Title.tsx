import React from 'react';
import logo from '@assets/images/logo.png';
import styles from './Title.scss';

const Title = () => (
  <>
    <div className={styles.container}>
      <img className={styles.logo} src={logo} alt={''} />
      <div className={styles.text}>УСИТ-ФЗЗ</div>
    </div>
  </>
);

export default Title;
