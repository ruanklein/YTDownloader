import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

const { ipcRenderer } = window.require('electron');

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggleNavbar       = this.toggleNavbar.bind(this);
    this.onQuitAppClick     = this.onQuitAppClick.bind(this);
    this.onMinimizeAppClick = this.onMinimizeAppClick.bind(this);
    this.toggleModal        = this.toggleModal.bind(this);

    this.state = {
      collapsed: true,
      modal: false
    };
  }

  onQuitAppClick() {
    ipcRenderer.send('TitleBar:Exit');
  }

  onMinimizeAppClick() {
    ipcRenderer.send('TitleBar:Minimize');
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {

    const showMenu = this.props.data.length < 1 && !this.props.dataLoading;

    return (
      <div>
        <Navbar color="faded" light sticky="top">
          <NavbarBrand className="mr-auto">
            <Button style={{ paddingLeft: '10px' }} onClick={this.onMinimizeAppClick} close aria-label="Cancel">
              <span aria-hidden>&ndash;</span>
            </Button>
            {this.props.data.length < 1 ? 
              <Button style={{ paddingLeft: '10px' }} className="App-title-bar-close" onClick={this.onQuitAppClick} close /> :
              <Button style={{ paddingLeft: '10px' }} className="App-title-bar-close" onClick={this.toggleModal} close /> }
          </NavbarBrand>
            {showMenu && <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />} 
            <Collapse isOpen={!this.state.collapsed} navbar>
              {showMenu && (
                <Nav navbar>
                  <NavItem className="App-nav-item">
                    <Link to="/About">About...</Link>
                  </NavItem>
                  <NavItem className="App-nav-item">
                    <Link to="/">YTDownloader</Link>
                  </NavItem>
                </Nav>
              )}
            </Collapse>
        </Navbar>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Exit</ModalHeader>
          <ModalBody>
            Really? You have URLs in list...
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.onQuitAppClick}>Exit</Button>{' '}
            <Button color="info" onClick={this.toggleModal}>Cancel</Button>
        </ModalFooter>
        </Modal>
      </div>
    );
  }
}