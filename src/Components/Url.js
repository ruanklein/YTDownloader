import React from 'react';
import { 
    InputGroup,
    InputGroupAddon,
    Button,
    Input
} from 'reactstrap';

export default class Url extends React.Component {

    constructor(props) {
        super(props);

        this.onAddClick     = this.onAddClick.bind(this);
        this.onBlur         = this.onBlur.bind(this);
    }

    onAddClick = () => this.props.addUrl(this.url);

    onBlur = e => this.url = e.target.value;

    render() {
        return (
            <div>
                <InputGroup size="sm">
                    <Input onBlur={this.onBlur} placeholder="https://youtu.be/..." />
                    <InputGroupAddon addonType="append">
                        <Button onClick={() => this.onAddClick()} size="sm" color="success">Add</Button>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        );
    }
}