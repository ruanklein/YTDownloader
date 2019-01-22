import * as Action from './actionTypes';

const initialState = {
    url: [],
    download: false
};

export default (state = initialState, action) => {
    switch(action.type) {
        case Action.UPDATE_URL:
            return { 
                ...state, 
                url: [...state.url, action.url]
            };
        case Action.REMOVE_URL:
            return {
                ...state,
                url: state.url.filter((item, index) => action.index !== index)
            }
        case Action.CLEAN_URL:
            return {
                ...state,
                url: [] 
            };
        case Action.START_DOWNLOAD:
            return {
                ...state,
                download: true
            };
        default:
            return state;
    }
}; 