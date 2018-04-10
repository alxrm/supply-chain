import React from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom'

const ProductCard = withRouter(styled.div`
  margin: 12px 0;
  transition: all .08s ease-in-out;
  box-shadow: 0 10px 35px rgba(0,0,0,0.1);
  align-items: stretch;
  height: 100%;
  padding: 40px 30px;
  background-color: #fff;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  }
`);

export default ({ name, uid, history }) => (
  <ProductCard onClick={() => history.push(`/products/${uid}`)}>
    <div>Product: {name}</div>
    <div>Uid: {uid}</div>
  </ProductCard>
);