import { CreateSubcategoryForm } from '@components/CreateSubcategoryForm/CreateSubcategoryForm';
import { EditSubcategoryForm } from '@components/EditSubcategoryForm/EditSubcategoryForm';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { RootState } from '@store';
import { Container } from '@ui/Container/Container';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';

export const EditSubcategoryPage: React.FC = () => {
  const { currentGroup, currentCategory } = useSelector((state: RootState) => state.catalogue);
  const { groupId, categoryId, subcategoryId } = useParams<{
    groupId: string;
    categoryId: string;
    subcategoryId: string;
  }>();

  if (!currentGroup || !currentCategory) {
    if (groupId && categoryId) {
      return <Redirect to={`/category/${categoryId}/subcategory/${subcategoryId}`} />;
    }

    return <Redirect to="/" />;
  }

  return (
    <>
      <Header isInteractive />
      <Container>
        <EditSubcategoryForm />
      </Container>
      <Footer />
    </>
  );
};
