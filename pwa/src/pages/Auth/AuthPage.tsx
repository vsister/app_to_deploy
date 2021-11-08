import React from 'react';
import { AuthForm } from '@components/AuthForm/AuthForm';
import { Header } from '@components/Header/Header';
import { Footer } from '@components/Footer/Footer';
import { Container } from '@ui/Container/Container';

export const AuthPage: React.FC = () => (
  <>
    <Header />
    <Container>
      <AuthForm />
    </Container>
    <Footer />
  </>
);
