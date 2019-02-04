import React from 'react';
import { Provider } from 'react-redux';

import { Container, Row, Col, Fade } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import TitleBarContainer from './Components/TitleBarContainer';
import AboutInfo from './Components/AboutInfo';

import Store from './Store';

export default class About extends React.Component {
  render() {
    return (
        <Provider store={Store}>
            <div className="App-title-bar">
                <TitleBarContainer />
            </div>
            <div className="App">
                <Container>
                    <Row>
                        <Col>
                        <Fade in={true} tag="h5" className="mt-3">
                            <AboutInfo />
                        </Fade>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Provider>
    );
  }
}