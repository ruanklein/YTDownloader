import { connect } from 'react-redux';
import List from './List';

import { REMOVE_URL } from '../actionTypes';

const mapStateToProps = state => ({ url: state.url });

const mapDispatchToProps = dispatch => ({
    removeUrl: index => dispatch({ type: REMOVE_URL, index })
});

export default connect(mapStateToProps, mapDispatchToProps)(List);