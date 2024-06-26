import React from 'react';

import {classNames, variationName} from '../../utilities/css';

import {Item} from './components';
import styles from './List.module.scss';

type Type = 'bullet' | 'number';

type Spacing = 'extraTight' | 'loose';

export interface ListProps {
  /**
   * Determines the space between list items
   * @default 'loose'
   */
  gap?: Spacing;
  /**
   * Type of list to display
   * @default 'bullet'
   */
  type?: Type;
  /** List item elements */
  children?: React.ReactNode;
}

export const List: React.FunctionComponent<ListProps> & {
  Item: typeof Item;
} = function List({children, gap = 'loose', type = 'bullet'}: ListProps) {
  const className = classNames(
    styles.List,
    gap && styles[variationName('spacing', gap)],
    type && styles[variationName('type', type)],
  );

  const ListElement = type === 'bullet' ? 'ul' : 'ol';
  return <ListElement className={className}>{children}</ListElement>;
};

List.Item = Item;
