import { connect } from 'react-redux';
import Download from './Download';

import { CLEAN_URL } from '../actionTypes';

const mapStateToProps = state => ({ url: state.url });

const mapDispatchToProps = dispatch => ({
    cleanUrl: () => dispatch({ type: CLEAN_URL })
});

export default connect(mapStateToProps, mapDispatchToProps)(Download);