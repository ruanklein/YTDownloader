import React from 'react';
import { 
    InputGroup,
    InputGroupAddon,
    Button,
    Input,
    Spinner,
    Alert
} from 'reactstrap';

const { ipcRenderer } = window.require('electron');

export default class Url extends React.Component {

    constructor(props) {
        super(props);

        this.state = { error: '' };
        this.url   = '';

        this.onAddClick     = this.onAddClick.bind(this);
        this.onBlur         = this.onBlur.bind(this);
        this.onDismiss      = this.onDismiss.bind(this);
    }

    twiceUrl = () => this.props.data.find(({ url }) => url === this.url);

    onAddClick = () => {

        // Find completed download and remove
        this.props.removeCompleted();

        // No URL
        if(this.url.length < 1) {
            this.setState({ error: 'Empty URL field!' });
            return;
        }

        // Invalid YouTube URL
        if(!this.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/)) {
            this.setState({ error: 'Invalid YouTube URL!' });
            return;
        }

        // Same url added
        if(this.twiceUrl()) {
            this.setState({ error: 'This URL has already been added!' });
            return;
        }

        // Get video info
        this.props.startDataLoading();

        ipcRenderer.send('YouTube:Info', this.url);
        ipcRenderer.on('YouTube:Info:Data', (e, info) => {

            if(this.twiceUrl()) return;

            if(info.error) {
                this.props.finishDataLoading();
                this.setState({ error: 'Error to get video url!' });
                return;
            }

            this.props.addUrl({
                url: this.url,
                complete: false,
                info: info.info
            });

            this.props.finishDataLoading();
        });
    };

    onBlur = e =>  {
        e.preventDefault(); 
        this.url = e.target.value;
    };

    onDismiss = () => this.setState({ error: '' });

    render() {
        return (
            <div>
                {this.props.downloading ? (
                    <div className="App-Loading">
                        <p>Downloading...</p>
                        <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" color="success" />
                    </div>
                    ) : (
                    <div>
                        {!this.props.dataLoading && (
                            <div>
                                <InputGroup>
                                    <Input onBlur={this.onBlur} placeholder="https://youtu.be/..." />
                                    <InputGroupAddon addonType="append">
                                        <Button onClick={() => this.onAddClick()} color="success">Add</Button>
                                    </InputGroupAddon>
                                </InputGroup>
                                {this.state.error.length > 0 && (
                                    <div>
                                        <br />
                                        <Alert color="danger" isOpen={true} toggle={() => this.onDismiss()}>
                                            {this.state.error}
                                        </Alert>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}