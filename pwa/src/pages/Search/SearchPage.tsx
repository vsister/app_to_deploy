import React from 'react';
import { RootState } from '@store';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { Container } from '@ui/Container/Container';
import { Header } from '@components/Header/Header';
import { Footer } from '@components/Footer/Footer';
import styles from '../Category/CategoryPage.scss';
import { Product } from '@components/Product/Product';
import { searchByName } from '@store/thunks/search';
import { LoadingStatus } from '@store/slices/user';

export const SearchPage: React.FC = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state: RootState) => state.search);
  const history = useHistory();
  const { query: searchQuery } = useParams<{ query: string }>();

  React.useEffect(() => {
    if (searchQuery) {
      dispatch(searchByName(decodeURIComponent(searchQuery)));
    } else {
      history.push('/');
    }
  }, [searchQuery]);

  // if (!products.length ) {
  //   return null;
  // }

  return (
    <>
      <Header isInteractive />
      <Container>
        <div className={styles.Main}>
          <div className={styles.Products__container}>
            {loading === LoadingStatus.Ongoing && <h1>Загрузка...</h1>}
            {loading === LoadingStatus.Complete && products.length ? (
              products.map(product => <Product product={product} />)
            ) : (
              <h1>Товаров не найдено</h1>
            )}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};
