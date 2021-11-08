import { CreateProductForm } from '@components/CreateProductForm/CreateProductForm';
import { EditProductForm } from '@components/EditProductForm/EditProductForm';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { Container } from '@ui/Container/Container';
import React from 'react';

export const EditProductPage: React.FC = () => (
  <>
    <Header isInteractive />
    <Container>
      <EditProductForm />
    </Container>
    <Footer />
  </>
);
