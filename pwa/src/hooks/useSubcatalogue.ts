import { RootState } from '@store';
import { breadcrumbsSlice } from '@store/slices/breadcrumbs';
import { catalogueSlice } from '@store/slices/catalogue';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

interface IUseSubcatalogue {
  attemptToSetCurrentGroup: () => void;
  setCurrentCategory: () => void;
}

export const useSubcatalogue = (): IUseSubcatalogue => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { groups, currentGroup } = useSelector((state: RootState) => state.catalogue);
  const { categoryId } = useParams<{ categoryId: string }>();

  const attemptToSetCurrentGroup = () => {
    const groupContainingCategory = groups.find(group => group.categories.find(category => category.id === categoryId));

    if (groupContainingCategory) {
      dispatch(catalogueSlice.actions.setCurrentGroup(groupContainingCategory));
    } else {
      history.push('/');
    }
  };

  const setCurrentCategory = () => {
    if (currentGroup) {
      const category = currentGroup.categories.find(category => category.id === categoryId);

      if (category) {
        dispatch(catalogueSlice.actions.setCurrentCategory(category));
        dispatch(
          breadcrumbsSlice.actions.setBreadcrumbs([
            {
              name: currentGroup.name,
              href: '/',
            },
            {
              name: category.name,
              href: `/category/${category.id}`,
            },
          ])
        );
      }
    }
  };

  return { attemptToSetCurrentGroup, setCurrentCategory };
};
