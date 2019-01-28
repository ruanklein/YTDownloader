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
        this.props.removeCompleted();
        this.props.startDownload();
        ipcRenderer.send('YouTube:Download', this.props.data);
    }

    render() {

        const { data } = this.props;
        let downloadButton = <div></div>;

        if(data.length > 0) {
            let array = data.filter((({ complete }) => !complete));
            if(array.length > 0)
                downloadButton = <Button onClick={() => this.onDownloadClick()} color="success" size="lg" block>Download</Button>;
        }

        return (
            <div>
                {!this.props.downloading && !this.props.dataLoading && this.props.data.length > 0 && (
                    <div>
                        {downloadButton}
                        <Button onClick={() => this.onCleanClick()} color="info" size="lg" block>Clear</Button>
                    </div>
                )}
            </div>
        );
    }
}