import { listsReducer } from './components/App';

const listOne = {
  objectID: '1',
  url: 'https://reactjs.org/',
  title: 'React',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
};

const listTwo = {
  objectID: '2',
  url: 'https://redux.js.org/',
  title: 'Redux',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
};

const lists = [listOne, listTwo];

describe('listsReducer', () => {
  test('removes a list from all lists', () => {
    const action: any = { type: 'REMOVE_LIST', payload: listOne };
    const state = { data: lists, isLoading: false, isError: false };
    const newState = listsReducer(state, action);

    const expectedState = {
      data: [listTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toEqual(expectedState);
  });
});
