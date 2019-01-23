import { connect } from 'react-redux';
import Url from './Url';

import { UPDATE_URL } from '../actionTypes';

const mapStateToProps = state => ({ 
    data: state.data,
    downloading: state.downloading
});

const mapDispatchToProps = dispatch => ({
    addUrl: data => dispatch({ type: UPDATE_URL, data })
});

export default connect(mapStateToProps, mapDispatchToProps)(Url);