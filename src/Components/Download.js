import React from 'react';
import { Button } from 'reactstrap';

export default class Download extends React.Component {
    render() {
        return (
            <div>
                <Button color="success">Download</Button>{' '}
                <Button color="info">Clear</Button>
            </div>
        );
    }
}