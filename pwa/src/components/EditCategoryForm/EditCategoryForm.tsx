import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@ui/Form/Form.scss';
import { Input } from '@ui/Input/Input';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { categoryNameValidationSchema } from '@utils/validationSchemas';
import { updateCategory } from '@store/thunks/catalogue';
import { RootState } from '@store';

export const EditCategoryForm: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCategory } = useSelector((state: RootState) => state.catalogue);

  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');

  React.useEffect(() => {
    if (currentCategory) {
      setName(currentCategory.name);
    }
  }, [currentCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await categoryNameValidationSchema.validate(name);
    } catch (err) {
      setNameError(err.errors.join(''));
      return;
    }

    if (currentCategory) {
      dispatch(updateCategory({ id: currentCategory.id, name }));
    }
  };

  return (
    <form className={styles.Container} onSubmit={handleSubmit}>
      <h1 className={styles.Title}>Изменить категорию</h1>

      <div className={styles.Item}>
        <label className={styles.Item__label}>Название категории: </label>
        <Input
          name="groupName"
          type="text"
          error={nameError}
          onFocus={() => setNameError('')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          value={name}
        />
      </div>
      <Button className={styles.Submit} name="Изменить" type="submit" theme={ButtonTheme.Dark} />
    </form>
  );
};
