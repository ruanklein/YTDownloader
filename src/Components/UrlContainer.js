import { connect } from 'react-redux';
import Url from './Url';

import { 
    UPDATE_URL,
    START_DATA_LOADING,
    FINISH_DATA_LOADING,
    REMOVE_COMPLETED
} from '../actionTypes';

const mapStateToProps = state => ({ 
    data: state.data,
    downloading: state.downloading,
    dataLoading: state.dataLoading
});

const mapDispatchToProps = dispatch => ({
    addUrl: data => dispatch({ type: UPDATE_URL, data }),
    startDataLoading: () => dispatch({ type: START_DATA_LOADING }),
    removeCompleted: () => dispatch({ type: REMOVE_COMPLETED }),
    finishDataLoading: () => dispatch({ type: FINISH_DATA_LOADING })
});

export default connect(mapStateToProps, mapDispatchToProps)(Url);