import { EditCategoryForm } from '@components/EditCategoryForm/EditCategoryForm';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { useSubcatalogue } from '@hooks/useSubcatalogue';
import { RootState } from '@store';
import { Container } from '@ui/Container/Container';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';

export const EditCategoryPage: React.FC = () => {
  const { attemptToSetCurrentGroup } = useSubcatalogue();
  const { groups, currentCategory } = useSelector((state: RootState) => state.catalogue);
  const { categoryId } = useParams<{ categoryId: string }>();

  if (!categoryId) {
    return <Redirect to="/" />;
  }

  if (!currentCategory) {
    return <Redirect to={`/category/${categoryId}`} />;
  }

  return (
    <>
      <Header isInteractive />
      <Container>
        <EditCategoryForm />
      </Container>
      <Footer />
    </>
  );
};
