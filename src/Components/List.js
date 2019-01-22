import React from 'react';
import { 
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Progress, Button
} from 'reactstrap';

export default class List extends React.Component {
    render() {
        return (
            <div>
                <ListGroup>
                    <ListGroupItem active>
                        <ListGroupItemHeading>Video One <Button close /></ListGroupItemHeading>
                        <ListGroupItemText>
                            Lorem ipsum kkwduhduhudehde
                        </ListGroupItemText>
                        <Progress animated color="info" value={25} />
                    </ListGroupItem>
                    <ListGroupItem>
                        <ListGroupItemHeading>Video Two <Button close /></ListGroupItemHeading>
                        <ListGroupItemText>
                            Lorem ipsum kkwduhduhudehde
                        </ListGroupItemText>
                        <Progress animated color="info" value={50} />
                    </ListGroupItem>
                    <ListGroupItem>
                        <ListGroupItemHeading>Video Three <Button close /></ListGroupItemHeading>
                        <ListGroupItemText>
                            Lorem ipsum kkwduhduhudehde
                        </ListGroupItemText>
                        <Progress animated color="info" value={75} />
                    </ListGroupItem>
                </ListGroup>
            </div>
        );
    }
}