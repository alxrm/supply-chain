import React, {Component} from 'react';
import {Button, Modal, ControlLabel, FormControl, InputGroup, FormGroup} from 'react-bootstrap';
import ExonumUtils from '../../utils/ExonumUtils';

export default class AttachToGroupModal extends Component {
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
          <Modal.Title>Add products to the group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          1234
        </Modal.Body>
      </Modal>
    );
  }
}