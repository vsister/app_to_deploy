import { EditGroupForm } from '@components/EditGroupForm/EditGroupForm';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { useSubcatalogue } from '@hooks/useSubcatalogue';
import { RootState } from '@store';
import { LoadingStatus } from '@store/slices/user';
import { Container } from '@ui/Container/Container';
import React from 'react';
import { useSelector } from 'react-redux';

export const EditGroupPage: React.FC = () => {
  const { attemptToSetCurrentGroup } = useSubcatalogue();
  const { groups, currentGroup, loading } = useSelector((state: RootState) => state.catalogue);

  if (!currentGroup && groups.length) {
    attemptToSetCurrentGroup();
  }

  if (loading === LoadingStatus.Ongoing) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Header isInteractive />
      <Container>
        <EditGroupForm />
      </Container>
      <Footer />
    </>
  );
};
