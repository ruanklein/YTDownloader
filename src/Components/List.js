import React from 'react';
import { 
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Progress, Button, Alert
} from 'reactstrap';

export default class List extends React.Component {

    constructor(props) {
        super(props);
        this.onRemoveItem = this.onRemoveItem.bind(this);
    }

    onRemoveItem = idx => this.props.removeUrl(idx);

    render() {
        return (
            <div>
                <ListGroup>
                    {this.props.data.map(({ url, progress, complete }, index) => {

                        const showRemoveButton = !complete && !this.props.downloading;

                        let content = (
                            <ListGroupItem key={index}>
                                <ListGroupItemHeading>
                                    Video {index} {showRemoveButton && <Button onClick={() => this.onRemoveItem(index)} close />}
                                    </ListGroupItemHeading>
                                <ListGroupItemText>
                                    Url: {url}
                                </ListGroupItemText>
                                {complete && <Alert color="primary">Completed! ;-)</Alert>}
                            </ListGroupItem>
                        );

                        // Downloading
                        if(progress > 0 && progress < 100)
                            content = (
                                <ListGroupItem key={index} active>
                                    <ListGroupItemHeading>
                                        Video {index}
                                        </ListGroupItemHeading>
                                    <ListGroupItemText>
                                        Url: {url}
                                    </ListGroupItemText>
                                    <Progress animated color="danger" value={progress} max={100} />
                                </ListGroupItem>
                            );

                        return content;
                    })}
                </ListGroup>
            </div>
        );
    }
}