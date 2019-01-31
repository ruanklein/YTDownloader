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
    };

    render() {
        const { data } = this.props;

        let content = <div></div>;
        let showDownloadButton = false;

        if(!this.props.downloading
           && !this.props.dataLoading
           && data.length > 0) {
               if(data.filter(({ complete }) => !complete).length > 0)
                    showDownloadButton = true;
                content = (
                    <div>
                        {showDownloadButton && <Button 
                                                  onClick={() => this.onDownloadClick()}
                                                  color="success"
                                                  size="lg"
                                                  block>
                                                    Download
                                                </Button>}
                        <Button onClick={() => this.onCleanClick()} color="info" size="lg" block>Clear</Button>
                    </div>
                );
        }

        return content;
    }
}