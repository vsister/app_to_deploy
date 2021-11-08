import React from 'react';
import debounce from 'lodash/debounce';
import styles from './Sidebar.scss';
import { ICategoryGroup } from 'shared/entities/Category';

export interface SidebarProps {
  topLevelCategories: ICategoryGroup[];
  selectedCategory: ICategoryGroup | null;
  onCategoryChange: (category: ICategoryGroup) => void;
}

let kek = false;
let threshold = -2;

export const Sidebar: React.FC<SidebarProps> = ({ topLevelCategories, selectedCategory, onCategoryChange }) => {
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const mousePosition = React.useRef<{ x: number; prevX: number }>({ x: 0, prevX: 0 });
  const categoryToSelectRef = React.useRef<{ category: ICategoryGroup | null }>({ category: null });

  const handleMouseMoveStopRef = React.useRef(
    debounce(() => {
      if (categoryToSelectRef.current.category) {
        onCategoryChange(categoryToSelectRef.current.category);
      }

      threshold = -2;
    }, 100)
  );

  const resetTresholdRef = React.useRef(
    debounce(() => {
      if (kek) {
        return;
      }

      threshold = -2;
    }, 100)
  );

  const handleSidebarMouseMove = (event: React.MouseEvent) => {
    handleMouseMoveStopRef.current();

    if (mousePosition.current.x === event.clientX) {
      return;
    }

    mousePosition.current.prevX = mousePosition.current.x;
    mousePosition.current.x = event.clientX;

    if (mousePosition.current.x - mousePosition.current.prevX >= 0) {
      kek = true;
      threshold = 2;

      setTimeout(() => {
        if (mousePosition.current.x - mousePosition.current.prevX <= 1) {
          threshold = -2;
        }

        kek = false;
      }, 25);
    }
  };

  const handleSidebarMouseLeave = (event: React.MouseEvent) => {
    mousePosition.current.prevX = event.clientX;
    mousePosition.current.x = event.clientX;

    categoryToSelectRef.current.category = null;
  };

  const getMouseDirection = () => mousePosition.current.prevX - mousePosition.current.x;

  const handleCategoryMouseEnter = (category: ICategoryGroup) => {
    const direction = getMouseDirection();

    if (direction >= threshold) {
      onCategoryChange(category);
      categoryToSelectRef.current.category = null;

      resetTresholdRef.current();
    } else {
      categoryToSelectRef.current.category = category;
    }
  };

  return (
    <div
      className={styles.Sidebar}
      ref={sidebarRef}
      onMouseMove={handleSidebarMouseMove}
      onMouseLeave={handleSidebarMouseLeave}
    >
      {topLevelCategories.map((category, index) => (
        <div
          key={category.name + index}
          className={`${styles.Sidebar__item} ${
            selectedCategory && category.name === selectedCategory.name ? styles.isActive : ''
          }`}
          onMouseEnter={() => handleCategoryMouseEnter(category)}
        >
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  );
};
