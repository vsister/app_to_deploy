import { CreateSubcategoryForm } from '@components/CreateSubcategoryForm/CreateSubcategoryForm';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { Container } from '@ui/Container/Container';
import React from 'react';

export const CreateSubcategoryPage: React.FC = () => (
  <>
    <Header isInteractive />
    <Container>
      <CreateSubcategoryForm />
    </Container>
    <Footer />
  </>
);
