import React, {Component} from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom'
import {Button} from 'react-bootstrap';

import connectWithDispatch from '../../utils/connectWithDispatch';
import AddProductModal from './AddProductModal';
import ProductCard from './ProductCard';
import {NoProductsBlock, NoProductsLabel} from './NoProducts';
import FormButton from '../Auth/FormButton';

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
    const { products, history } = this.props;
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