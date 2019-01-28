import { connect } from 'react-redux';
import Download from './Download';

import { 
    CLEAN_URL,
    START_DOWNLOAD,
    REMOVE_COMPLETED
} from '../actionTypes';

const mapStateToProps = state => ({ 
    data: state.data,
    downloading: state.downloading,
    dataLoading: state.dataLoading
 });

const mapDispatchToProps = dispatch => ({
    cleanUrl: () => dispatch({ type: CLEAN_URL }),
    removeCompleted: () => dispatch({ type: REMOVE_COMPLETED }),
    startDownload: () => dispatch({ type: START_DOWNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(Download);