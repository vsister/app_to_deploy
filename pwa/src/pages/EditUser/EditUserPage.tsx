import { CreateUserForm } from '@components/CreateUserForm/CreateUserForm';
import { EditUserForm } from '@components/EditUserForm/EditUserForm';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { Container } from '@ui/Container/Container';
import React from 'react';

export const EditUserPage: React.FC = () => (
  <>
    <Header isInteractive />
    <Container>
      <EditUserForm />
    </Container>
    <Footer />
  </>
);
