import { connect } from 'react-redux';
import Url from './Url';

import { UPDATE_URL } from '../actionTypes';

const mapStateToProps = state => ({ url: state.url });

const mapDispatchToProps = dispatch => ({
    addUrl: url => dispatch({ type: UPDATE_URL, url })
});

export default connect(mapStateToProps, mapDispatchToProps)(Url);