import { RootState } from '@store';
import { catalogueSlice, CatalogueState } from '@store/slices/catalogue';
import { LoadingStatus } from '@store/slices/user';
import { getCatalogue } from '@store/thunks/catalogue';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICategoryGroup } from 'shared/entities/Category';

interface IUseCatalogue {
  catalogue: CatalogueState;
  setCurrentGroup: (group: ICategoryGroup) => void;
}

export const useCatalogue = (): IUseCatalogue => {};
