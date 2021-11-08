import React from 'react';
import { Input, InputTheme } from '@ui/Input/Input';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { RootState } from '@store/index';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingStatus } from '@store/slices/user';
import { authenticateUser } from '@store/thunks/user';
import { Redirect } from 'react-router-dom';
import styles from './AuthForm.scss';
import { passwordValidationSchema, usernameValidationSchema } from '@utils/validationSchemas';

export const AuthForm: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [userError, setUserError] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const user = useSelector((state: RootState) => state.user);
  const {
    loading,
    authStatus: { isAuthenticated },
  } = user;

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usernameValidationSchema.validate(username);
    } catch (err) {
      setUserError(err.errors.join(''));
      return;
    }

    try {
      await passwordValidationSchema.validate(password);
    } catch (err) {
      setPasswordError(err.errors.join(''));
      return;
    }

    dispatch(authenticateUser({ username, password }));
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Warning}>
        Сервис предназначен для автоматизации формирования заявки на закупку. Для входа на сайт необходимо использовать
        единую учетную запись вида stXXXXXX, где X - цифра от 0 до 9.
      </div>
      <form className={styles.Form}>
        <h2 className={styles.Form__title}>Требуется авторизация</h2>
        <div className={styles.Form__inputContainer}>
          <label htmlFor="username" className={styles.Form__inputLabel}>
            Имя пользователя
          </label>
          <Input
            theme={InputTheme.Light}
            type="text"
            name="username"
            disabled={loading === LoadingStatus.Ongoing}
            placeholder="st000000"
            className={styles.Form__input}
            error={userError}
            value={username}
            onChange={e => setUsername(e.target.value)}
            onFocus={() => setUserError('')}
          ></Input>
        </div>
        <div className={styles.Form__inputContainer}>
          <label htmlFor="password" className={styles.Form__inputLabel}>
            Пароль
          </label>
          <Input
            theme={InputTheme.Light}
            type="password"
            name="password"
            disabled={loading === LoadingStatus.Ongoing}
            placeholder=""
            className={styles.Form__input}
            error={passwordError}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setPasswordError('')}
          ></Input>
        </div>
        <Button onClick={handleSubmit} name="Войти" className={styles.Form__submitButton} theme={ButtonTheme.Dark} />
      </form>
    </div>
  );
};
