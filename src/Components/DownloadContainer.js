import { connect } from 'react-redux';
import Download from './Download';

import { CLEAN_URL, START_DOWNLOAD } from '../actionTypes';

const mapStateToProps = state => ({ 
    data: state.data,
    downloading: state.downloading
 });

const mapDispatchToProps = dispatch => ({
    cleanUrl: () => dispatch({ type: CLEAN_URL }),
    startDownload: () => dispatch({ type: START_DOWNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(Download);