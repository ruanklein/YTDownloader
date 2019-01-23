import React from 'react';
import { Button } from 'reactstrap';

const { ipcRenderer } = window.require('electron');

export default class Download extends React.Component {

    constructor(props) {
        super(props);
        this.onCleanClick = this.onCleanClick.bind(this);
    }

    onCleanClick = () => this.props.cleanUrl();

    onDownloadClick = () => {
        this.props.startDownload();
        ipcRenderer.send('Download', this.props.data);
    }

    render() {
        return (
            <div>
                {!this.props.downloading && (
                    <div>
                        {this.props.data.length > 0 && (
                            <div>
                                <Button onClick={() => this.onDownloadClick()} color="success" size="lg" block>Download</Button>{' '}
                                <Button onClick={() => this.onCleanClick()} color="info" size="lg" block>Clear</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}