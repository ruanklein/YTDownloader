import React from 'react';
import { 
    InputGroup,
    InputGroupAddon,
    Button,
    Input
} from 'reactstrap';

export default class Url extends React.Component {
    render() {
        return (
            <div>
                <InputGroup size="sm">
                    <Input placeholder="https://youtu.be/..." />
                    <InputGroupAddon addonType="append">
                        <Button size="sm" color="success">Add</Button>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        );
    }
}