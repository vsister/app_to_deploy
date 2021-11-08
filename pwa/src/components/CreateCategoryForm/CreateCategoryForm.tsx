import { RootState } from '@store';
import { categoryNameValidationSchema } from '@utils/validationSchemas';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@ui/Form/Form.scss';
import { createCategory } from '@store/thunks/catalogue';
import { Input } from '@ui/Input/Input';
import Button, { ButtonTheme } from '@ui/Button/Button';

export const CreateCategoryForm: React.FC = () => {
  const dispatch = useDispatch();
  const { currentGroup } = useSelector((state: RootState) => state.catalogue);

  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await categoryNameValidationSchema.validate(name);
    } catch (err) {
      setNameError(err.errors.join(''));
      return;
    }

    if (currentGroup) {
      dispatch(createCategory({ groupId: currentGroup?.id, name }));
    }
  };

  return (
    <form className={styles.Container} onSubmit={handleSubmit}>
      <h1 className={styles.Title}>Создать категорию</h1>

      <div className={styles.Item}>
        <label className={styles.Item__label}>Название категории: </label>
        <Input
          name="categoryName"
          type="text"
          error={nameError}
          onFocus={() => setNameError('')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          value={name}
        />
      </div>
      <Button className={styles.Submit} name="Создать" type="submit" theme={ButtonTheme.Dark} />
    </form>
  );
};
