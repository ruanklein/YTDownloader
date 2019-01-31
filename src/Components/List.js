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
        this.onProgress = this.onProgress.bind(this);
    }

    onRemoveItem = idx => this.props.removeUrl(idx);

    onProgress = data => {
        data.array[data.index] = data.progress;
        this.setState({ progress: data.array });

        if(parseInt(data.progress) === 100)
            this.props.downloadComplete(data.index);
        
        // Download complete
        if(this.props.data.filter(({ complete }) => !complete).length < 1)
            setTimeout(() => { 
                this.props.finishDownload();
                this.setState({ progress: [] });
            }, 3000);
    };

    componentDidMount() {
        let array = this.state.progress;
        this.props.data.map(() => array.push(0));

        if(array.length)
            this.setState({ progress: array });

        ipcRenderer.on('YouTube:Download:Progress', (e, index, progress) =>
            this.onProgress({ index, progress, array }));
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
                        {this.props.data.map(({ info, complete, format }, index) => {

                            const { description, duration } = info;
                            const { progress } = this.state;

                            let { title } = info;
                            let content;

                            title = `(${duration}) ${title}`;

                            // Downloading
                            if(this.props.downloading) {
                                content = (
                                    <div key={index}>
                                        <ListGroupItem>
                                            <ListGroupItemHeading>
                                                {title}
                                            </ListGroupItemHeading>
                                            <ListGroupItemText>
                                                {description}
                                            </ListGroupItemText>
                                            <Progress 
                                                color="info"
                                                value={progress[index]}
                                                max={100}>
                                            {progress[index] <= 100 && `${progress[index]}%`}
                                            </Progress>
                                            <Badge pill>{format}</Badge>
                                        </ListGroupItem>
                                    </div>
                                );
                            }
                            // Normal
                            else {
                                content = (
                                    <ListGroupItem key={index} className="justify-content-between">
                                        <ListGroupItemHeading>
                                            {title} {!complete && <Button onClick={() => this.onRemoveItem(index)} close />}
                                            </ListGroupItemHeading>
                                        <ListGroupItemText>
                                            {description}
                                        </ListGroupItemText>
                                        {complete && <Alert color="primary">Completed! ;-)</Alert>}
                                        <Badge pill>{format}</Badge>
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