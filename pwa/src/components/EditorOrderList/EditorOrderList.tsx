import { RootState } from '@store';
import { getDocument, getEditorOrders } from '@store/thunks/order';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@ui/Link/Link';
import { getAllProducts } from '@store/thunks/product';
import { productSlice } from '@store/slices/product';
import styles from './EditorOrderList.scss';
import { OrderStatus } from 'shared/entities/Order';

export const EditorOrderList: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.order);
  const { products } = useSelector((state: RootState) => state.product);

  React.useEffect(() => {
    dispatch(getEditorOrders());
    dispatch(getAllProducts());
  }, [user]);

  if (!orders.length && !products.length) {
    return null;
  }

  const pendingOrders = orders.filter(order => order.status === OrderStatus.Pending);

  return (
    <>
      {pendingOrders && (
        <>
          <h1 className={styles.Label}>Заявки, требующие проверки</h1>
          <div className={styles.List}>
            {pendingOrders.map(pendingOrder => (
              <div key={pendingOrder.id} className={styles.List__item}>
                <div className={styles.List__left}>
                  <div className={styles.List__itemName}>
                    {pendingOrder.name}
                    <Link
                      name="(Скачать документ)"
                      className={styles.List__itemAction}
                      onClick={() => dispatch(getDocument(pendingOrder.id))}
                    />
                  </div>
                  {pendingOrder.products.map((orderProduct, index) => (
                    <Link
                      key={orderProduct.id}
                      href={`/category/${orderProduct.breadcrumbs[1].id}/subcategory/${orderProduct.breadcrumbs[2].id}/product/${orderProduct.id}`}
                      name={`${index + 1}. ${orderProduct.name} (${orderProduct.quantity} ед.)`}
                      style={{ fontSize: '14px', paddingLeft: '8px' }}
                    />
                  ))}
                </div>
                <div className={styles.List__itemActions}>
                  <Link name="Подвердить" className={styles.List__itemAction} onClick={() => {}} />
                  <Link name="Отклонить" className={styles.List__itemAction} onClick={() => {}} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};
