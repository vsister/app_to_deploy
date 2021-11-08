import React, { useState } from 'react';
import { Header } from '@components/Header/Header';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { Footer } from '@components/Footer/Footer';
import { Input, InputTheme } from '../../ui/Input/Input';
import styles from './OrderService.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';
import { createOrder } from '@store/thunks/order';
import { OrderStatus } from 'shared/entities/Order';

const Values = [
  {
    value: 'ДЛЯ ОБЕСПЕЧЕНИЯ:',
  },
  {
    value: 'СРОКИ',
  },
  {
    value: 'АДРЕС:',
  },
  {
    value: 'ИСТОЧНИКИ ФИНАНСИРОВАНИЯ:',
  },
  {
    value: 'КОНТАКТНОЕ ЛИЦО ПО ЗАЯВКЕ:',
  },
];

export const OrderMeta: React.FC = () => {
  const { cart } = useSelector((state: RootState) => state.cart);
  const userData = useSelector((state: RootState) => state.user.data);
  const [orderNumber, setOrderNumber] = useState('');
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [financingSource, setFinancingSource] = useState('');
  const [feedbackContact, setFeedbackContact] = useState('');
  const [materiallyResponsible, setMateriallyResponsible] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(
      createOrder({
        name,
        author: userData._id,
        meta: {
          orderNumber,
          totalPrice: 1,
          deadline,
          deliveryAddress,
          financingSource,
          feedbackContact,
          materiallyResponsible,
        },
        products: cart.map(cartItem => ({
          id: cartItem.product.id,
          quantity: cartItem.quantity,
        })),
      } as any)
    );
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Title}>Оформление заявки</div>
      <div className={styles.Container__input}>
        <div className={styles.Container__row}>
          <span className={styles.Value}>НОМЕР ЗАКАЗА:</span>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderNumber(e.target.value)}
            theme={InputTheme.Light}
            placeholder="12-34-56-78"
            name="Person"
            type="string"
            className={styles.Input}
          />
        </div>
        <div className={styles.Container__row}>
          <span className={styles.Value}>НАЗВАНИЕ ЗАКАЗА:</span>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            theme={InputTheme.Light}
            placeholder="Для обеспечения работоспособности сети СПбГУ в интересах научного парка"
            name="Purpose"
            type="string"
            className={styles.Input}
          />
        </div>
        <div className={styles.Container__row}>
          <span className={styles.Value}>СРОКИ:</span>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
            theme={InputTheme.Light}
            placeholder="30 дней с момента заключения договора"
            name="Deadline"
            type="string"
            className={styles.Input}
          />
        </div>
        <div className={styles.Container__row}>
          <span className={styles.Value}>АДРЕС:</span>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeliveryAddress(e.target.value)}
            theme={InputTheme.Light}
            placeholder="г. Санкт-Петербург, г. Петергоф, Астрономическая ул., 6/1"
            name="Address"
            type="string"
            className={styles.Input}
          />
        </div>
        <div className={styles.Container__row}>
          <span className={styles.Value}>ИСТОЧНИКИ ФИНАНСИРОВАНИЯ:</span>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFinancingSource(e.target.value)}
            theme={InputTheme.Light}
            placeholder="программа развития, распорядитель С.В.Микушев"
            name="Finance"
            type="string"
            className={styles.Input}
          />
        </div>
        <div className={styles.Container__row}>
          <span className={styles.Value}>КОНТАКТНОЕ ЛИЦО ПО ЗАЯВКЕ:</span>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedbackContact(e.target.value)}
            theme={InputTheme.Light}
            placeholder="Васильев Михаил Викторович, начальник службы ЭИВР УСИТ"
            name="Person"
            type="string"
            className={styles.Input}
          />
        </div>
        <div className={styles.Container__row}>
          <span className={styles.Value}>МАТЕРИАЛЬНО ОТВЕТСТВЕННОЕ ЛИЦО:</span>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMateriallyResponsible(e.target.value)}
            theme={InputTheme.Light}
            placeholder="Васильев Михаил Викторович, начальник службы ЭИВР УСИТ"
            name="Person"
            type="string"
            className={styles.Input}
          />
        </div>
      </div>

      <Button onClick={() => handleSubmit()} theme={ButtonTheme.Dark} name="Создать заявку" className={styles.Button} />
    </div>
  );
};
