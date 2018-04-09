import React from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom'

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

export default ProductCard;