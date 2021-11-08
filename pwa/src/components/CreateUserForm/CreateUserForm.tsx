import { createUser } from '@store/thunks/user';
import React from 'react';
import { useDispatch } from 'react-redux';
import { IUser, UserRole } from 'shared/entities/User';
import styles from '@ui/Form/Form.scss';
import { Input } from '@ui/Input/Input';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { passwordValidationSchema, usernameValidationSchema } from '@utils/validationSchemas';

export const CreateUserForm: React.FC = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = React.useState('');
  const [usernameError, setUsernameError] = React.useState('');

  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');

  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const [role, setRole] = React.useState<UserRole>(UserRole.Purchaser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await usernameValidationSchema.validate(name);
    } catch (err) {
      setNameError(err.errors.join(''));
      return;
    }

    try {
      await usernameValidationSchema.validate(username);
    } catch (err) {
      setUsernameError(err.errors.join(''));
      return;
    }

    try {
      await passwordValidationSchema.validate(password);
    } catch (err) {
      setPasswordError(err.errors.join(''));
      return;
    }

    dispatch(createUser({ username, name, password, role }));
  };

  return (
    <form className={styles.Container} onSubmit={handleSubmit}>
      <h1 className={styles.Title}>Создать пользователя</h1>

      <div className={styles.Item}>
        <label className={styles.Item__label}>Имя пользователя: </label>
        <Input
          name="name"
          type="text"
          error={nameError}
          onFocus={() => setNameError('')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          value={name}
        />
      </div>
      <div className={styles.Item}>
        <label className={styles.Item__label}>Логин пользователя: </label>
        <Input
          name="username"
          type="text"
          error={usernameError}
          onFocus={() => setUsernameError('')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      <div className={styles.Item}>
        <label className={styles.Item__label}>Пароль пользователя: </label>
        <Input
          name="password"
          type="text"
          error={passwordError}
          onFocus={() => setPasswordError('')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <div className={styles.Item}>
        <label className={styles.Item__label}>Роль пользователя: </label>
        <select
          name="name"
          value={role}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as UserRole)}
        >
          <option value={UserRole.Purchaser}>Покупатель</option>
          <option value={UserRole.Editor}>Редактор</option>
          <option value={UserRole.Expert}>Эксперт</option>
          <option value={UserRole.Admin}>Администратор</option>
        </select>
      </div>
      <Button className={styles.Submit} name="Создать" type="submit" theme={ButtonTheme.Dark} />
    </form>
  );
};
