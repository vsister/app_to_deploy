import { createUser, updateUser } from '@store/thunks/user';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@ui/Form/Form.scss';
import { Input } from '@ui/Input/Input';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { passwordValidationSchema, usernameValidationSchema } from '@utils/validationSchemas';
import { UserService } from '@services/User/UserService';
import { useParams } from 'react-router-dom';
import { RootState } from '@store';
import { ErrorResponse, SuccessResponse } from '@services/Service';
import { IUser, UserRole } from 'shared/entities/User';

const userService = new UserService();

export const EditUserForm: React.FC = () => {
  const dispatch = useDispatch();
  const { jwt } = useSelector((state: RootState) => state.user.authStatus);
  const { userId } = useParams<{ userId: string }>();

  const [loading, setIsLoading] = React.useState(false);

  const [username, setUsername] = React.useState('');
  const [usernameError, setUsernameError] = React.useState('');

  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');

  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const [role, setRole] = React.useState<UserRole>(UserRole.Purchaser);

  React.useEffect(() => {
    const getUser = async () => {
      if (userId) {
        setIsLoading(true);
        const response = await userService.getOne(userId, jwt);

        if (response instanceof SuccessResponse) {
          const { username, name, role } = response.data;
          setUsername(username);
          setName(name);
          setRole(role);
          setIsLoading(false);
        }

        if (response instanceof ErrorResponse) {
          alert(response.error);
        }
      }
    };

    getUser();
  }, []);

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

    if (password.length) {
      try {
        await passwordValidationSchema.validate(password);
      } catch (err) {
        setPasswordError(err.errors.join(''));
        return;
      }
    }

    let user: IUser = { name, username, role };

    if (password.length) {
      user = {
        ...user,
        password,
      };
    }

    dispatch(updateUser({ id: userId, user }));
  };

  return (
    <form className={styles.Container} onSubmit={handleSubmit}>
      <h1 className={styles.Title}>Изменить пользователя</h1>

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
        <label className={styles.Item__label}>Пароль пользователя </label>
        <Input
          name="password"
          type="text"
          placeholder="Можно оставить пустым"
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
      <Button className={styles.Submit} name="Изменить" type="submit" theme={ButtonTheme.Dark} />
    </form>
  );
};
