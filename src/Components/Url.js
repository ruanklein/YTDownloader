import React from 'react';
import { 
    InputGroup,
    InputGroupAddon,
    Button,
    Input,
    Spinner,
    Alert
} from 'reactstrap';

export default class Url extends React.Component {

    constructor(props) {
        super(props);

        this.state = { errors: [] };

        this.url    = '';
        this.errors = [];

        this.onAddClick     = this.onAddClick.bind(this);
        this.onBlur         = this.onBlur.bind(this);
        this.onDismiss      = this.onDismiss.bind(this);
    }

    onAddClick = () => {

        // No url
        if(this.url.length < 1) {
            this.errors.push({
                msg: 'Add URL(s) to start downloading!' 
            });
        }
        else {
            // Invalid YouTube URL
            if(!this.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/))
                this.errors.push({
                    msg: 'Invalid YouTube URL!'
                });
            // Same url added
            if(this.props.data.find(({ url }) => url === this.url))
                this.errors.push({
                    msg: 'This URL has already been included!'
                });
        }

        if(this.errors.length > 0) {
            this.setState({ errors : this.errors });
            return;
        }

        this.props.addUrl({ 
            url: this.url,
            progress: 0,
            complete: false,
            error: false
        });
    };

    onBlur = e => this.url = e.target.value;

    onDismiss = index => {
        this.errors = this.errors.filter((item, idx) => index !== idx);
        this.setState({ errors: this.errors });
    };

    render() {
        return (
            <div>
                {this.props.downloading ? (
                    <div style={{ textAlign: 'center' }}>
                        <p>Downloading...</p>
                        <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" color="success" />
                    </div>
                    ) : (
                    <div>
                        <InputGroup>
                            <Input onBlur={this.onBlur} placeholder="https://youtu.be/..." />
                            <InputGroupAddon addonType="append">
                                <Button onClick={() => this.onAddClick()} color="success">Add</Button>
                            </InputGroupAddon>
                        </InputGroup>
                        {this.state.errors.map(({ msg }, index) => (
                            <div>
                                <br />
                                <Alert key={index} color="danger" isOpen={true} toggle={() => this.onDismiss(index)}>
                                    {msg}
                                </Alert>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}