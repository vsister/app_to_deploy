import { RootState } from '@store';
import { getUserOrders } from '@store/thunks/order';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UserOrderTable.scss';
import { IOrder, OrderStatus } from 'shared/entities/Order';

export const UserOrderTable: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.order);

  React.useEffect(() => {
    dispatch(getUserOrders());
  }, [user]);

  if (!orders.length) {
    return null;
  }

  const renderStatus = (order: IOrder) => {
    switch (order.status) {
      case OrderStatus.Approved:
        return 'Подтвержден редактором';
      case OrderStatus.Rejected:
        return 'Отклонен редактором';
      case OrderStatus.Verified:
        return 'Проверен экспертом';
      default:
        return 'Открыт';
    }
  };

  return (
    <table className={styles.Table}>
      <tr className={styles.Table__row}>
        <th className={styles.Table__heading}>Номер</th>
        <th className={styles.Table__heading}>Название</th>
        <th className={styles.Table__heading}>Дата создания</th>
        <th className={styles.Table__heading}>Статус</th>
      </tr>
      {orders.map(order => (
        <tr key={order.id}>
          <td className={styles.Table__item}>{order.meta.orderNumber}</td>
          <td className={styles.Table__item}>{order.name}</td>
          <td className={styles.Table__item}>{`${new Date(order.createdAt).getDate()}.${new Date(
            order.createdAt
          ).getMonth()}.${new Date(order.createdAt).getFullYear()}`}</td>
          <td className={styles.Table__item}>{renderStatus(order)}</td>
        </tr>
      ))}
    </table>
  );
};
