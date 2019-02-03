import { connect } from 'react-redux';
import List from './List';

import {
    REMOVE_URL,
    FINISH_DOWNLOAD,
    DOWNLOAD_COMPLETE,
    TOGGLE_CONVERT,
    ERROR_MESSAGE
} from '../actionTypes';

const mapStateToProps = state => ({ 
    data: state.data,
    downloading: state.downloading,
    dataLoading: state.dataLoading,
});

const mapDispatchToProps = dispatch => ({
    removeUrl: index => dispatch({ type: REMOVE_URL, index }),
    downloadComplete: index => dispatch({ type: DOWNLOAD_COMPLETE, index }),
    finishDownload: () => dispatch({ type: FINISH_DOWNLOAD }),
    toggleConverting: index => dispatch({ type: TOGGLE_CONVERT, index }),
    errorMessage: (index, message) => dispatch({ type: ERROR_MESSAGE, index, message })
});

export default connect(mapStateToProps, mapDispatchToProps)(List);