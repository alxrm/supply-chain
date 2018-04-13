import React, {Component} from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom'
import {Button} from 'react-bootstrap';

import connectWithDispatch from '../../utils/connectWithDispatch';
import AddProductModal from './AddProductModal';
import ProductCard from './ProductCard';
import {NoProductsBlock, NoProductsLabel} from './NoProducts';
import FormButton from '../Auth/FormButton';
import PageTitle from '../Layout/PageTitle';

class ProductList extends Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleProductChecked = this.handleProductChecked.bind(this);

    this.state = {
      show: false,
      productSelections: {}
    };
  }

  componentDidMount() {
    const { ownerProductsByKey, publicKey } = this.props;
    ownerProductsByKey(publicKey);
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleProductChecked(uid, selected) {
    this.setState({
      productSelections: {
        ...this.state.productSelections,
        [uid]: selected
      }
    })
  }

  render() {
    const { products, history } = this.props;
    const { productSelections } = this.state;
    const noProducts = !Object.keys(products).length;

    console.log(products)

    return (
      <div>
        <PageTitle>Товары</PageTitle>
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
          <ProductCard
            history={history}
            key={it.uid}
            checked={productSelections[it.uid]}
            onProductChecked={this.handleProductChecked}
            {...it}
          />
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