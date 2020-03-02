import queryString from 'query-string';
import actions from './actions';

const initState = {
  tags: [],
  tagsLoading: false,
  selectedTag: getSelectedTag(),
};

export function getSelectedTag() {
  const localStorageTag = localStorage.getItem('selected_tag');
  const queryParamTag = queryString.parse(window.location.search).tag;

  if (queryParamTag) {
    return queryParamTag;
  } else if (localStorageTag) {
    return localStorageTag;
  } else {
    return 'all';
  }
}

export default function tagsReducer(state = initState, action) {
  switch (action.type) {
    case actions.SET_TAGS:
      return {
        ...state,
        tags: action.tags,
      };
    case actions.SET_TAGS_LOADING:
      return {
        ...state,
        tagsLoading: true,
      };
    case actions.SET_TAGS_LOADED:
      return {
        ...state,
        tagsLoading: false,
      };
    case actions.SELECT_TAG:
      return {
        ...state,
        selectedTag: action.tag,
      };
    default:
      return state;
  }
}
