import { CreateUserForm } from '@components/CreateUserForm/CreateUserForm';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { Container } from '@ui/Container/Container';
import React from 'react';

export const CreateUserPage: React.FC = () => (
  <>
    <Header isInteractive />
    <Container>
      <CreateUserForm />
    </Container>
    <Footer />
  </>
);
