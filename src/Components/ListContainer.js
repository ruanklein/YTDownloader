import { connect } from 'react-redux';
import List from './List';

import {
    REMOVE_URL,
    FINISH_DOWNLOAD,
    DOWNLOAD_COMPLETE
} from '../actionTypes';

const mapStateToProps = state => ({ 
    data: state.data,
    downloading: state.downloading,
    dataLoading: state.dataLoading
});

const mapDispatchToProps = dispatch => ({
    removeUrl: index => dispatch({ type: REMOVE_URL, index }),
    downloadComplete: index => dispatch({ type: DOWNLOAD_COMPLETE, index }),
    finishDownload: () => dispatch({ type: FINISH_DOWNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(List);