import * as Action from './actionTypes';

const initialState = {
    data: [],
    downloading: false
};

export default (state = initialState, action) => {
    switch(action.type) {
        case Action.UPDATE_URL:
            return { 
                ...state, 
                data: [...state.data, action.data]
            };
        case Action.REMOVE_URL:
            return {
                ...state,
                data: state.data.filter((item, index) => action.index !== index)
            }
        case Action.CLEAN_URL:
            return {
                ...state,
                data: [] 
            };
        case Action.START_DOWNLOAD:
            return {
                ...state,
                downloading: true
            }
        case Action.FINISH_DOWNLOAD:
            return {
                ...state,
                downloading: false
            }
        default:
            return state;
    }
}; 