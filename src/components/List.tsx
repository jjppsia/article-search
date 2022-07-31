import React from 'react';
import { ReactComponent as Check } from './check.svg';

import { ListType, Lists } from './App';

type ListProps = {
  list: Lists;
  onRemoveItem: (item: ListType) => void;
};

export const List = React.memo(({ list, onRemoveItem }: ListProps) => (
  <ul>
    {list.map((item) => (
      <Items key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
));

type ItemProps = {
  item: ListType;
  onRemoveItem: (item: ListType) => void;
};

const Items = ({ item, onRemoveItem }: ItemProps) => (
  <li className='item'>
    <span style={{ width: '40%' }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%' }}>{item.author}</span>
    <span style={{ width: '10%' }}>{item.num_comments}</span>
    <span style={{ width: '10%' }}>{item.points}</span>
    <span style={{ width: '10%' }}>
      <button
        className='button button_remove'
        type='button'
        onClick={() => onRemoveItem(item)}
      >
        <Check height='18px' width='18px' />
      </button>
    </span>
  </li>
);
