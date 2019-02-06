import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

const { ipcRenderer } = window.require('electron');

export default class AboutInfo extends React.Component {

    constructor(props) {
        super(props);

        this.link        = 'github.com/RuanKlein/YTDownloader';
        this.onLinkClick = this.onLinkClick.bind(this);
    }

    onLinkClick() {
        ipcRenderer.send('About:Link', `https://${this.link}`);
    }

    render() {
        return (
            <div className="text-center">
                <img src="/assets/about.png" className="img-fluid" alt="Developer" />
                <br /><br />
                <h4>YTDownloader 1.0.0</h4>
                <h6>YouTube Downloader for MP3/MP4</h6>
                <br />
                <p style={{ fontSize: '13px' }}>
                    Developed by Ruan Klein<br />{'<ruan.klein@gmail.com>'}<br />
                    <Button className="App-link" onClick={this.onLinkClick} size="sm" color="link">Source Code on GitHub</Button><br /><br />
                    <Link to="/">
                        <Button outline color="secondary">Back</Button>
                    </Link>
                </p>

            </div>
        );
    }
}