import React from 'react';
import { Button } from 'reactstrap';

const { ipcRenderer } = window.require('electron');

export default class Download extends React.Component {

    constructor(props) {
        super(props);

        this.onCleanClick       = this.onCleanClick.bind(this);
        this.onDownloadClick    = this.onDownloadClick.bind(this);
    }

    onCleanClick() { 
        this.props.cleanUrl();
    }

    onDownloadClick() {
        this.props.removeCompleted();
        this.props.startDownload();
        ipcRenderer.send('YouTube:Download', this.props.data);
    }

    render() {
        let content = <div></div>;
        let showDownloadButton = false;

        if(!this.props.downloading && !this.props.dataLoading && this.props.data.length > 0) {
               if(this.props.data.filter(({ complete }) => !complete).length > 0)
                    showDownloadButton = true;

                content = (
                    <div>
                        {showDownloadButton && <Button
                                                  outline 
                                                  onClick={this.onDownloadClick}
                                                  color="secondary"
                                                  size="lg"
                                                  block>
                                                    Download
                                                </Button>}
                        <Button outline onClick={this.onCleanClick} color="secondary" size="lg" block>Clear</Button>
                    </div>
                );
        }

        return content;
    }
}