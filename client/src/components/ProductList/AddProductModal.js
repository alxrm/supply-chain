import React, {Component} from 'react';
import {Button, Modal, ControlLabel, FormControl, InputGroup, FormGroup} from 'react-bootstrap';
import ExonumUtils from '../../utils/ExonumUtils';

export default class AddProductModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleGenerateGuid = this.handleGenerateGuid.bind(this);
    this.handleAddProduct = this.handleAddProduct.bind(this);

    this.state = {
      name: '',
      guid: '',
      secretKey: ''
    };
  }

  handleChange({ target }) {
    const { value, id } = target;

    this.setState({ [id]: value });
  }

  handleGenerateGuid() {
    this.setState({ guid: ExonumUtils.generateGuid() });
  }

  handleAddProduct() {
    const { handleClose, addProduct } = this.props;
    const { name, guid, secretKey } = this.state;

    addProduct(guid, name, secretKey);
    handleClose();
  }

  render() {
    const { show, handleClose } = this.props;
    const { name, guid, secretKey } = this.state;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Adding new product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <ControlLabel>Name</ControlLabel>
            <FormControl
              type="text"
              id="name"
              placeholder="Enter product name"
              value={name}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Product GUID</ControlLabel>
            <InputGroup>
              <InputGroup.Button>
                <Button onClick={this.handleGenerateGuid}>Generate</Button>
              </InputGroup.Button>
              <FormControl
                type="text"
                id="guid"
                placeholder="Enter product GUID"
                value={guid}
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
          <Button onClick={this.handleAddProduct} bsStyle="success">Add</Button>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
