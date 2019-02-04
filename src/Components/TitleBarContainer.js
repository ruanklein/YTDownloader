import { connect } from 'react-redux';
import TitleBar from './TitleBar';

const mapStateToProps = state => ({
    data: state.data,
    dataLoading: state.dataLoading
});

export default connect(mapStateToProps)(TitleBar);