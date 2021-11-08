import React from 'react';
import { categorySlice } from '@store/slices/category';
import { useDispatch, useSelector } from 'react-redux';
import { Filter } from '@components/Filter/Filter';
import { RootState } from '@store';
import styles from './Filters.scss';
import { IFilter, IRangeFilter, SpecificationType } from 'shared/entities/Specification';

export const Filters: React.FC = () => {
  const { currentSubcategory } = useSelector((state: RootState) => state.catalogue);
  const { filters } = useSelector((state: RootState) => state.category);
  const dispatch = useDispatch();

  const setPrice = (data: IRangeFilter) => {
    dispatch(categorySlice.actions.setFilters({ ...filters, price: data }));
  };

  const setFilter = (filterData: IFilter): void => {
    if (filters && filters.specifications) {
      const filterToChange = filters.specifications.find(
        specification => specification.specificationId === filterData.specificationId
      );

      const newSpecifications = filters.specifications.filter(filter => filter !== filterToChange);

      if (
        (filterData.type !== SpecificationType.Range && filterData.valueIds.length) ||
        filterData.type === SpecificationType.Range
      ) {
        newSpecifications.push(filterData);
      }

      dispatch(
        categorySlice.actions.setFilters({
          ...filters,
          specifications: newSpecifications,
        })
      );
    }
  };

  if (!currentSubcategory) {
    return null;
  }

  const { specifications } = currentSubcategory;

  if (!filters || !filters.specifications) {
    return null;
  }

  return (
    <div className={styles.Container}>
      <Filter
        specification={currentSubcategory.priceRange}
        key={currentSubcategory.priceRange.id}
        filter={filters.price}
        setFilter={setPrice}
      />
      {specifications.map(specification => (
        <Filter
          specification={specification}
          key={specification.id}
          filter={
            filters.specifications?.find(
              specificationFilter => specificationFilter.specificationId === specification.id
            ) ?? null
          }
          setFilter={setFilter}
        />
      ))}
    </div>
  );
};
