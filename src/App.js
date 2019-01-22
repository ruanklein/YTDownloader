import React from 'react';
import { Provider } from 'react-redux';

import { Container, Row, Col } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import UrlContainer from './Components/UrlContainer';
import ListContainer from './Components/ListContainer';
import DownloadContainer from './Components/DownloadContainer';

import Store from './Store';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <div className="App">
          <Container>
            <Row>
              <Col>
                <UrlContainer />
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <ListContainer />
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <DownloadContainer />
              </Col>
            </Row>
          </Container>
        </div>
      </Provider>
    );
  }
}