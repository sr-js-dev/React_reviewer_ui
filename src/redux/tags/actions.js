const tagsActions = {
  GET_TAGS: 'GET_TAGS',
  SET_TAGS: 'SET_TAGS',
  SET_TAGS_LOADING: 'SET_TAGS_LOADING',
  SET_TAGS_LOADED: 'SET_TAGS_LOADED',
  SELECT_TAG: 'SELECT_TAG',
};

export const getTags = function() {
  return {
    type: tagsActions.GET_TAGS,
  };
};

export const selectTag = function(data) {
  return {
    type: tagsActions.SELECT_TAG,
    tag: data.tag,
    updateData: data.updateData,
  };
};

export default tagsActions;
