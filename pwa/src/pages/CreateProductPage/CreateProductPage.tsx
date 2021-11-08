import { CreateProductForm } from '@components/CreateProductForm/CreateProductForm';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { RootState } from '@store';
import { Container } from '@ui/Container/Container';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';

export const CreateProductPage: React.FC = () => (
  <>
    <Header isInteractive />
    <Container>
      <CreateProductForm />
    </Container>
    <Footer />
  </>
);
