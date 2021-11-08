import React, { useEffect } from 'react';
import { CatalogueMenu } from '@components/CatalogueMenu/CatalogueMenu';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { Container } from '@ui/Container/Container';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';
import { getCatalogue } from '@store/thunks/catalogue';
import { catalogueSlice } from '@store/slices/catalogue';

export const CataloguePage = (): React.ReactElement => {
  const dispatch = useDispatch();
  const catalogue = useSelector((state: RootState) => state.catalogue);

  React.useEffect(() => {
    dispatch(getCatalogue());
  }, []);

  React.useEffect(() => {
    if (catalogue.groups.length) {
      dispatch(catalogueSlice.actions.setCurrentGroup(catalogue.groups[0]));
    }
  }, [catalogue.groups]);

  return (
    <>
      <Header isInteractive />
      <Container>
        <CatalogueMenu />
      </Container>
      <Footer />
    </>
  );
};
