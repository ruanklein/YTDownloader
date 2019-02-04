import React from 'react';
import { Provider } from 'react-redux';

import { Container, Row, Col, Fade } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import TitleBarContainer from './Components/TitleBarContainer';
import UrlContainer from './Components/UrlContainer';
import ListContainer from './Components/ListContainer';
import DownloadContainer from './Components/DownloadContainer';

import Store from './Store';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <div className="App-title-bar">
          <TitleBarContainer />
        </div>
        <Container>
          <div className="App">
              <Row>
                <Col>
                  <Fade in={true}>
                    <UrlContainer />
                  </Fade>
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
          </div>
        </Container>
      </Provider>
    );
  }
}