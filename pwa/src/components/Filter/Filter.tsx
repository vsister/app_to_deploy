import React from 'react';
import styles from './Filter.scss';
import {
  SpecificationType,
  ICategorySpecification,
  IRangeCategorySpecification,
  IFilter,
  IRadioFilter,
  ISelectFilter,
  IRangeFilter,
} from 'shared/entities/Specification';
import InputRange from '@ui/InputRange/InputRange';

export interface FilterProps {
  specification: ICategorySpecification;
  filter: IFilter | null;
  setFilter: (filterData: IFilter) => void;
}

export const RangeFilter: React.FC<FilterProps & { specification: IRangeCategorySpecification<any> }> = props => {
  const { specification, filter, setFilter } = props;

  const from = React.useRef<number>(0);
  const to = React.useRef<number>(0);

  const setFilterValue = (e: any, origin: 'to' | 'from') => {
    if (origin === 'to') {
      to.current = e.target.value ? parseInt(e.target.value) : specification.range.maxValue;
    } else {
      from.current = e.target.value ? parseInt(e.target.value) : specification.range.minValue;
    }

    if (!from.current || from.current < specification.range.minValue) {
      from.current = specification.range.minValue;
    }

    if (!to.current || to.current > specification.range.maxValue) {
      to.current = specification.range.maxValue;
    }

    setFilter({
      specificationId: specification.id,
      type: specification.type,
      to: to.current,
      from: from.current,
    });
  };

  return (
    <div className={styles.Filter__inputContainer}>
      <div className={styles.Filter__range}>
        <InputRange
          className={styles.Filter__input}
          name="from"
          onBlur={(e: React.FocusEvent) => setFilterValue(e, 'from')}
          defaultValue={(filter as IRangeFilter)?.from}
          type="number"
          placeholder={specification.range.minValue.toString()}
          text={'от'}
        />
        <InputRange
          className={styles.Filter__input}
          name="to"
          onBlur={(e: React.FocusEvent) => setFilterValue(e, 'to')}
          defaultValue={(filter as IRangeFilter)?.to}
          type="number"
          placeholder={specification.range.maxValue.toString()}
          text={'до'}
        />
      </div>
    </div>
  );
};

export const Filter: React.FC<FilterProps> = props => {
  const { specification, filter, setFilter } = props;

  const renderFilter = (specification: ICategorySpecification, filter: IFilter | null): React.ReactElement | null => {
    switch (specification.type) {
      case SpecificationType.Radio: {
        return (
          <div className={styles.Filter__inputContainer}>
            {specification.values.map(value => {
              const filterIsSelected = Boolean(
                filter && (filter as IRadioFilter).valueIds.find(valueId => valueId === value._id)
              );
              const setFilterValue = (valueId: string) => {
                if (filterIsSelected) {
                  setFilter({
                    specificationId: specification.id,
                    type: specification.type,
                    valueIds: [valueId],
                  });
                } else {
                  setFilter({
                    specificationId: specification.id,
                    type: specification.type,
                    valueIds: [valueId],
                  });
                }
              };
              return (
                <div key={value._id}>
                  <input
                    onChange={() => setFilterValue(value._id)}
                    checked={filterIsSelected}
                    type="radio"
                    name={value.value}
                    className={styles.Filter__input}
                  />
                  <label htmlFor={value.value}>{value.value}</label>
                </div>
              );
            })}
          </div>
        );
      }
      case SpecificationType.Range: {
        return <RangeFilter specification={specification} filter={filter} setFilter={setFilter} />;
      }
      case SpecificationType.Select:
        return (
          <div className={styles.Filter__inputContainer}>
            {specification.values.map(value => {
              const filterIsSelected = Boolean(
                filter && (filter as IRadioFilter).valueIds.find(valueId => valueId === value._id)
              );
              const setFilterValue = (valueId: string) => {
                if (filterIsSelected) {
                  setFilter({
                    specificationId: specification.id,
                    type: specification.type,
                    valueIds: (filter as IRadioFilter).valueIds.filter(value => value !== valueId),
                  });
                } else {
                  setFilter({
                    specificationId: specification.id,
                    type: specification.type,
                    valueIds: filter ? [...(filter as IRadioFilter).valueIds, valueId] : [valueId],
                  });
                }
              };
              return (
                <div key={value._id}>
                  <input
                    onChange={() => setFilterValue(value._id)}
                    checked={filterIsSelected}
                    type="checkbox"
                    name={value.value}
                    className={styles.Filter__input}
                  />
                  <label htmlFor={value.value}>{value.value}</label>
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.Filter__container}>
      <p className={styles.Filter__label}>
        {specification.type === SpecificationType.Range
          ? `${specification.name}, ${specification.range.unit}`
          : specification.name}
      </p>
      {renderFilter(specification, filter)}
    </div>
  );
};
