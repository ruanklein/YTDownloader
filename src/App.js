import React from 'react';

import { Container, Row, Col } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Url from './Components/Url';
import List from './Components/List';
import Download from './Components/Download';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Row>
            <Col>
              <Url />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <List />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Download />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}