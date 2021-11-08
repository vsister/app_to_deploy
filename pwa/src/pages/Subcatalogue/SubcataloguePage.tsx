import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { SubcatalogueMenu } from '@components/SubcatalogueMenu/SubcatalogueMenu';
import { useSubcatalogue } from '@hooks/useSubcatalogue';
import { RootState } from '@store';
import { LoadingStatus } from '@store/slices/user';
import { getCatalogue } from '@store/thunks/catalogue';
import { Container } from '@ui/Container/Container';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';

export const SubcataloguePage = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { attemptToSetCurrentGroup, setCurrentCategory } = useSubcatalogue();
  const { groups, currentGroup, loading } = useSelector((state: RootState) => state.catalogue);
  const { categoryId } = useParams<{ categoryId: string }>();

  if (!groups.length && loading === LoadingStatus.Initial) {
    dispatch(getCatalogue());
  }

  if (!categoryId) {
    return <Redirect to="/" />;
  }

  if (!currentGroup && groups.length) {
    attemptToSetCurrentGroup();
  }

  setCurrentCategory();

  if (loading === LoadingStatus.Ongoing) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Header isInteractive />
      <Container>
        <SubcatalogueMenu />
      </Container>
      <Footer />
    </>
  );
};
