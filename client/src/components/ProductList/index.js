import React, {Component} from 'react';
import styled from 'styled-components';
import times from 'lodash.times'
import {withRouter} from 'react-router-dom'
import {Button, Checkbox, Modal, ControlLabel, FormControl, InputGroup, FormGroup} from 'react-bootstrap';

import ExonumUtils from '../../utils/ExonumUtils';
import connectWithDispatch from '../../utils/connectWithDispatch';
import FormButton from "../Auth/FormButton";
import CenteringContainer from "../Layout/CenteringContainer";

const ProductCard = withRouter(styled.div`
  border: #ccc solid 1px;
  padding: 32px;
  margin: 12px 0;
  transition: all .08s ease-in-out;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
  }
`);

const NoProductsBlock = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
  padding: 16px;
`;

const NoProductsLabel = styled.div`
  font-size: 21px;
  margin: 12px;
`;

class AddProductModal extends Component {
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
    const { show, handleClose, addProduct } = this.props;
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

class ProductList extends Component {
  constructor(props) {
    super(props);
    const { ownerProductsByKey, publicKey } = props;
    ownerProductsByKey(publicKey);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    const { products, addProduct, history } = this.props;
    const noProducts = !Object.keys(products).length;

    console.log(products)

    return (
      <div>
        <AddProductModal show={this.state.show} handleClose={this.handleClose} {...this.props} />
        {noProducts &&
        <NoProductsBlock>
          <NoProductsLabel>No products yet</NoProductsLabel>
          <Button bsStyle="primary" onClick={this.handleShow}>Add product</Button>
        </NoProductsBlock>}
        {!noProducts && <div>
          <FormButton onClick={this.handleShow} primary>Add product</FormButton>
          <FormButton onClick={() => console.log('Send')} primary>Send</FormButton>
        </div>}
        {!noProducts && Object.values(products).map(it =>
          <ProductCard onClick={() => history.push(`/products/${it.uid}`)} key={it.uid}>
            <div>Product: {it.name}</div>
            <div>Uid: {it.uid}</div>
          </ProductCard>
        )}
      </div>
    );
  }
}

export default connectWithDispatch(state => ({
  publicKey: state.auth.user.publicKey,
  products: state.ownerProducts.products,
  error: state.ownerProducts.error,
}))(ProductList);