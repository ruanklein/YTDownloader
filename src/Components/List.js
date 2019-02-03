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
    Spinner
} from 'reactstrap';

const { ipcRenderer } = window.require('electron');

export default class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = { progress: [] };

        this.onRemoveItem = this.onRemoveItem.bind(this);
    }

    onRemoveItem(index) { 
        this.props.removeUrl(index);
    }

    componentDidMount() {
        ipcRenderer.on('YouTube:Download:Progress', (e, index, percentage, message) => {
            let array = this.state.progress;
            array[index] = { percentage, message };
            this.setState({ progress: array });
        });

        ipcRenderer.on('Converting:Toggle', (e, index) => {
            this.props.toggleConverting(index);
        });

        ipcRenderer.on('Error', (e, index, message) => {
            this.props.errorMessage(index, message);
            this.props.downloadComplete(index);
        });

        ipcRenderer.on('YouTube:Download:Finish', (e, index) => {
            this.props.downloadComplete(index);
            if(this.props.data.filter(({ complete }) => !complete).length < 1)
                setTimeout(() => { 
                    this.props.finishDownload();
                    this.setState({ progress: [] });
                }, 3000);
        });
    }

    render() {
        return (
            <div>
                {this.props.dataLoading ? (
                    <div className="App-Loading">
                        <p>Loading video data...</p>
                        <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" color="info" />
                    </div>
                    ) : (
                    <ListGroup>
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
                                        <div key={index}>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    {title}
                                                </ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {description}
                                                </ListGroupItemText>
                                                <Alert color="danger">
                                                    {item.error.message}
                                                </Alert>
                                                <Badge color="danger" pill>{item.format}</Badge>
                                            </ListGroupItem>
                                        </div>
                                    );
                                else
                                    content = (
                                        <div key={index}>
                                            <ListGroupItem>
                                                <ListGroupItemHeading>
                                                    {title}
                                                </ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {description}
                                                </ListGroupItemText>
                                                {item.converting ?
                                                    <Progress
                                                        animated 
                                                        color="info"
                                                        value={percentage}
                                                        max={100}>
                                                            {message}
                                                    </Progress> :
                                                    <Progress 
                                                        color="info"
                                                        value={percentage}
                                                        max={100}>
                                                            {percentage <= 100 && `${message} (${percentage}%)`}
                                                    </Progress>}
                                                <Badge color="primary" pill>{item.format}</Badge>
                                            </ListGroupItem>
                                        </div>
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
                                        {item.complete && !item.error.status && <Alert color="primary">Completed! ;-)</Alert>}
                                        {item.error.status ?
                                         <Badge color="danger" pill>{item.format}</Badge> :
                                         <Badge color="primary" pill>{item.format}</Badge>}
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