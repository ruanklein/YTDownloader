import React from 'react';
import {
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Progress,
    Badge,
    Button,
    Alert,
    Spinner,
    Fade
} from 'reactstrap';

const { ipcRenderer } = window.require('electron');

export default class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = { progress: [] };

        this.onRemoveItem       = this.onRemoveItem.bind(this);
    }

    onRemoveItem(index) { 
        this.props.removeUrl(index);
    }

    componentDidMount() {

        this.componentIsMounted = true;

        ipcRenderer.on('YouTube:Download:Progress', (e, index, percentage, message) => {
            if(this.componentIsMounted) {
                let array = this.state.progress;

                if(typeof array[index] === 'undefined') {
                    array[index] = { percentage, message };
                    this.setState({ progress: array });
                    return;
                }

                const percentageA = parseInt(array[index].percentage);
                const percentageB = parseInt(percentage);

                const messageA    = new String(array[index].message).valueOf();
                const messageB    = new String(message).valueOf();

                if(percentageA !== percentageB || messageA !== messageB) {
                    array[index] = { percentage, message };
                    this.setState({ progress: array });
                }
            }
        });

        ipcRenderer.on('Converting:Toggle', (e, index) => {
            if(this.componentIsMounted)
                this.props.toggleConverting(index);
        });

        ipcRenderer.on('Error', (e, index, message) => {
            if(this.componentIsMounted) {
                this.props.errorMessage(index, message);
                this.props.downloadComplete(index);
            }
        });

        ipcRenderer.on('YouTube:Download:Finish', (e, index) => {
            if(this.componentIsMounted) {
                this.props.downloadComplete(index);
                if(this.props.data.filter(({ complete }) => !complete).length < 1)
                    setTimeout(() => { 
                        this.props.finishDownload();
                        this.setState({ progress: [] });
                    }, 3000);
            }
        });
    }

    componentWillUnmount() {
        this.componentIsMounted = false;
    }

    render() {
        return (
            <div>
                {this.props.dataLoading ? (
                    <div className="App-Loading">
                        <p>Loading video data...</p><br />
                        <Spinner style={{ width: '6rem', height: '6rem' }} type="grow" color="secondary" />
                    </div>
                    ) : (
                    <ListGroup className="App-list">
                        {this.props.data.map((item, index) => {

                            const { description, duration } = item.info;
                            const { progress } = this.state;

                            const percentage = typeof progress[index] === 'undefined' ?
                                               0 : parseInt(progress[index].percentage);
                            const message    = typeof progress[index] === 'undefined' ?
                                               'Loading...' : progress[index].message;

                            let { title } = item.info;
                            let content;

                            title = `(${duration}) ${title}`;

                            // Downloading
                            if(this.props.downloading) {
                                if(item.error.status)
                                    content = (
                                        <Fade in={true} key={index}>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    {title}
                                                </ListGroupItemHeading>
                                                <Alert color="danger">
                                                    {item.error.message}
                                                </Alert>
                                            </ListGroupItem>
                                        </Fade>
                                    );
                                else
                                    content = (
                                        <Fade in={true} key={index}>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    {title}
                                                </ListGroupItemHeading>
                                                {item.converting ?
                                                    <Progress
                                                        animated 
                                                        color="secondary"
                                                        value={percentage}
                                                        max={100}>
                                                            {message}
                                                    </Progress> :
                                                    <Progress 
                                                        color="secondary"
                                                        value={percentage}
                                                        max={100}>
                                                            {percentage <= 100 && `${message} (${percentage}%)`}
                                                    </Progress>}
                                            </ListGroupItem>
                                        </Fade>
                                    );
                            }
                            // Normal
                            else {
                                content = (
                                    <ListGroupItem key={index} className="justify-content-between">
                                        <ListGroupItemHeading>
                                            {title} {(!item.complete || item.error.status) && 
                                                        <Button onClick={() => this.onRemoveItem(index)} close />}
                                            </ListGroupItemHeading>
                                        <ListGroupItemText>
                                            {description}
                                        </ListGroupItemText>
                                        {item.complete && !item.error.status && 
                                                <Alert color="secondary">Complete! ;-)</Alert>}
                                        {item.error.status ?
                                                <Badge color="danger" pill>{item.format}</Badge> :
                                                <Badge color="secondary" pill>{item.format}</Badge>}
                                    </ListGroupItem>
                                );
                            }

                            return content;
                        })}
                    </ListGroup>
                )}
            </div>
        );
    }
}