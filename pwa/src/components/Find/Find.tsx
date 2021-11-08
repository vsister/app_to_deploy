import React from 'react';
import styles from './Find.scss';
import ButtonWthIcn, { ButtonThemeIcn } from '@ui/ButtonWthIcn/Button';
import { Input, InputTheme } from '@ui/Input/Input';
import { IconName } from '@ui/Icon/icons';
import { useHistory } from 'react-router-dom';

export const Find = (): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState('');
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent): void => {
    console.log('submit');

    if (inputValue) {
      history.push(`/search/${encodeURIComponent(inputValue)}`);
    }
    e.preventDefault();
  };

  return (
    <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
      <Input
        theme={InputTheme.Dark}
        onChange={e => setInputValue(e.target.value)}
        className={styles.Find__input}
        placeholder="Поиск"
        type="text"
        name="search"
      />
      <ButtonWthIcn type="submit" theme={ButtonThemeIcn.Bordo} icon={IconName.Search} name="Найти" />
    </form>
  );
};
