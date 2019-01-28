import * as Action from './actionTypes';

const initialState = {
    data: [],
    downloading: false,
    dataLoading: false,
    converting: false
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
        case Action.REMOVE_COMPLETED:
            return {
                ...state,
                data: state.data.filter(({ complete }) => !complete)
            };
        case Action.DOWNLOAD_COMPLETE: {
            let array = state.data;
            array.map((item, index) => {
                if(action.index === index)
                    array[index].complete = true;
                return array;
            });

            return {
                ...state,
                data: array
            };
        }
        case Action.START_DATA_LOADING:
            return {
                ...state,
                dataLoading: true
            };
        case Action.FINISH_DATA_LOADING:
            return {
                ...state,
                dataLoading: false
            };
        case Action.START_DOWNLOAD:
            return {
                ...state,
                downloading: true
            };
        case Action.FINISH_DOWNLOAD:
            return {
                ...state,
                downloading: false
            };
        default:
            return state;
    }
}; 