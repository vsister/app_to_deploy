import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@ui/Form/Form.scss';
import { Input } from '@ui/Input/Input';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { categoryNameValidationSchema, usernameValidationSchema } from '@utils/validationSchemas';
import { updateGroup } from '@store/thunks/catalogue';
import { RootState } from '@store';

export const EditGroupForm: React.FC = () => {
  const dispatch = useDispatch();
  const { currentGroup } = useSelector((state: RootState) => state.catalogue);

  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');

  React.useEffect(() => {
    if (currentGroup) {
      setName(currentGroup.name);
    }
  }, [currentGroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await categoryNameValidationSchema.validate(name);
    } catch (err) {
      setNameError(err.errors.join(''));
      return;
    }

    if (currentGroup) {
      dispatch(updateGroup({ id: currentGroup.id, name }));
    }
  };

  return (
    <form className={styles.Container} onSubmit={handleSubmit}>
      <h1 className={styles.Title}>Изменить группу</h1>

      <div className={styles.Item}>
        <label className={styles.Item__label}>Название группы: </label>
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
