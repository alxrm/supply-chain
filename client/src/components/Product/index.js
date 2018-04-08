import React from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode.react';

const ProductInfo = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
  padding: 16px;
`;

const ProductUid = styled.div`
  margin: 12px;
  font-size: 18px;
  
`;

export default (props) => {
  const uid = props.match.params.uid;

  return (
    <ProductInfo>
      <QRCode value={uid} renderAs='svg' size={256} />
      <ProductUid>Product {uid}</ProductUid>
    </ProductInfo>
  );
};