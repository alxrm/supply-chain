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
import AddToGroupModal from './AddToGroupModal';

class ProductList extends Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleProductChecked = this.handleProductChecked.bind(this);

    this.state = {
      addProductModal: false,
      attachToGroupModal: false,
      productSelections: {}
    };
  }

  componentDidMount() {
    const { ownerProductsByKey, publicKey } = this.props;
    ownerProductsByKey(publicKey);
  }

  handleClose(modalName) {
    return () => {
      this.setState({ [modalName]: false });
    }
  }

  handleShow(modalName) {
    return () => {
      this.setState({ [modalName]: true });
    }
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
    const { productSelections, addProductModal, attachToGroupModal } = this.state;
    const noProducts = Object.keys(products).length === 0;
    const hasSelections = Object.values(productSelections).filter(it => it).length !== 0;


    console.log(products)

    return (
      <div>
        <PageTitle>Товары</PageTitle>
        <AddProductModal
          show={addProductModal}
          handleClose={this.handleClose('addProductModal')}
          {...this.props}
        />
        <AddToGroupModal
          show={attachToGroupModal}
          items={Object.keys(productSelections).filter(it => productSelections[it])}
          handleClose={this.handleClose('attachToGroupModal')}
          {...this.props}
        />
        {noProducts &&
        <NoProductsBlock>
          <NoProductsLabel>Товаров не найдено</NoProductsLabel>
          <FormButton color="#0277BD" onClick={this.handleShow}>Добавить товар</FormButton>
        </NoProductsBlock>}
        {!noProducts &&
        <div>
          <FormButton
            onClick={this.handleShow('addProductModal')}
            color="#0277BD">
            Add product
          </FormButton>
          {hasSelections && <FormButton
            onClick={this.handleShow('attachToGroupModal')}
            color="#0277BD">
            Add to group
          </FormButton>}
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