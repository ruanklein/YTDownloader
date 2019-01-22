import React from 'react';
import { Button } from 'reactstrap';

export default class Download extends React.Component {

    constructor(props) {
        super(props);
        this.onCleanClick = this.onCleanClick.bind(this);
    }

    onCleanClick = () => this.props.cleanUrl();

    render() {
        return (
            <div>
                <Button color="success">Download</Button>{' '}
                <Button onClick={() => this.onCleanClick()} color="info">Clear</Button>
            </div>
        );
    }
}