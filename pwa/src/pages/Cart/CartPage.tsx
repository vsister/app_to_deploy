import { Cart } from '@components/Cart/Cart';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { Container } from '@ui/Container/Container';
import React from 'react';

export const CartPage: React.FC = () => (
  <>
    <Header isInteractive />
    <Container>
      <Cart />
    </Container>
    <Footer />
  </>
);
