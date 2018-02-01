import React, {Component} from 'react';
import styled from 'styled-components';
import { Checkbox } from 'react-bootstrap';

import connectWithDispatch from '../../utils/connectWithDispatch';

const ProductCard = styled.div`
  background-color: black;
  color: whitesmoke;
  padding: 32px;
  margin: 12px 0;
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
        {Object.keys(products).map(it =>
          <ProductCard key={it}>
            <div>Product: {products[it].name}</div>
            <Checkbox/>
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