import React, {Component} from 'react';
import {Button, Modal, ControlLabel, FormControl, InputGroup, FormGroup} from 'react-bootstrap';
import ExonumUtils from '../../utils/ExonumUtils';

export default class AddToGroupModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleGenerateGuid = this.handleGenerateGuid.bind(this);
    this.handleAdd = this.handleAdd.bind(this);

    this.state = {
      groupGuid: '',
      secretKey: ''
    };
  }

  handleChange({ target }) {
    const { value, id } = target;

    this.setState({ [id]: value });
  }

  handleGenerateGuid() {
    this.setState({ groupGuid: ExonumUtils.generateGuid() });
  }

  handleAdd() {
    const { handleClose, attachToGroup, items } = this.props;
    const { groupGuid, secretKey } = this.state;

    items.forEach(uid => attachToGroup(uid, groupGuid, secretKey));
    handleClose();
  }

  render() {
    const { show, handleClose, items } = this.props;
    const { groupGuid, secretKey } = this.state;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add {items.length} products to the group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <ControlLabel>Group GUID</ControlLabel>
            <InputGroup>
              <InputGroup.Button>
                <Button onClick={this.handleGenerateGuid}>Generate</Button>
              </InputGroup.Button>
              <FormControl
                type="text"
                id="groupGuid"
                placeholder="Enter product GUID"
                value={groupGuid}
                onChange={this.handleChange}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Secret key</ControlLabel>
            <FormControl
              type="text"
              id="secretKey"
              placeholder="Enter secret key"
              value={secretKey}
              onChange={this.handleChange}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleAdd} bsStyle="success">Add to group</Button>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}