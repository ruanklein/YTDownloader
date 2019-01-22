import React from 'react';
import { 
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Progress, Button
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
                    {this.props.url.map((url, index) => (
                        <ListGroupItem key={index}>
                            <ListGroupItemHeading>Video {index} <Button onClick={() => this.onRemoveItem(index)} close /></ListGroupItemHeading>
                            <ListGroupItemText>
                                Url: {url}
                            </ListGroupItemText>
                            <Progress animated color="info" value={2} />
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </div>
        );
    }
}