import axios from 'axios';
import * as React from 'react';
import './App.css';
import { List } from './List';
import { Search } from './Search';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// custom hook
const useSemiPersistentState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  let isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) ?? initialState
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      console.log('A');
      localStorage.setItem(key, value);
    }
  }, [value, key]);
  return [value, setValue];
};

export type ListType = {
  objectID?: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

export type Lists = Array<ListType>;

type ListsState = {
  data: Lists;
  isLoading: boolean;
  isError: boolean;
};

interface ListsFetchInitAction {
  type: 'LISTS_FETCH_INIT';
}

interface ListsFetchSuccessAction {
  type: 'LISTS_FETCH_SUCCESS';
  payload: Lists;
}

interface ListsFetchFailureAction {
  type: 'LISTS_FETCH_FAILURE';
}

interface ListsRemoveAction {
  type: 'REMOVE_LIST';
  payload: ListType;
}

type ListsAction =
  | ListsFetchInitAction
  | ListsFetchSuccessAction
  | ListsFetchFailureAction
  | ListsRemoveAction;

// reducer function
export const listsReducer = (state: ListsState, action: ListsAction) => {
  switch (action.type) {
    case 'LISTS_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'LISTS_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'LISTS_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_LIST':
      return {
        ...state,
        data: state.data.filter(
          (list) => list.objectID !== action.payload.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const [lists, dispatchLists] = React.useReducer(listsReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchLists = React.useCallback(async () => {
    dispatchLists({ type: 'LISTS_FETCH_INIT' });

    try {
      const result = await axios(url);

      dispatchLists({
        type: 'LISTS_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchLists({ type: 'LISTS_FETCH_FAILURE' });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchLists();
  }, [handleFetchLists]);

  const handleRemoveList = React.useCallback((item: ListType) => {
    dispatchLists({
      type: 'REMOVE_LIST',
      payload: item,
    });
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    e.preventDefault();
  };

  console.log('B:App');

  return (
    <div className='container'>
      <h1>My Lists. </h1>

      <Search
        searchTerm={searchTerm}
        handleSearchInput={handleSearchInput}
        handleSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {lists.isError && <p>Something went wrong...</p>}
      {lists.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={lists.data} onRemoveItem={handleRemoveList} />
      )}
    </div>
  );
};

export default App;
