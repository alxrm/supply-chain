import React, {Component} from 'react';
import styled from 'styled-components';
import {Checkbox} from 'react-bootstrap';

import connectWithDispatch from '../../utils/connectWithDispatch';
import FormButton from "../Auth/FormButton";

const ProductCard = styled.div`
  border: #ccc solid 1px;
  padding: 32px;
  margin: 12px 0;
  transition: all .08s ease-in-out;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
  }
`;

class ProductList extends Component {
  constructor(props) {
    super(props);
    const { ownerProductsByKey, publicKey } = props;

    ownerProductsByKey(publicKey);
  }

  render() {
    const { products } = this.props;

    return (
      <div>
        <div>
          <FormButton onClick={() => {}} color={'#333'}>Add product</FormButton>
          <FormButton onClick={() => {}} primary>Send</FormButton>
        </div>
        {Object.keys(products).map(it =>
          <ProductCard key={it}>
            <div>Product: {products[it].name}</div>
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