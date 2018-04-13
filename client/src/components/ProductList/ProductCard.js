import React from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom'
import QRCode from 'qrcode.react';

const ProductCard = withRouter(styled.div`
  display: table;
  width: 100%;
  background-color: #fff;
  padding: 20px 30px 20px;
  margin: 12px 0;
  transition: transform .2s,box-shadow .2s;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.03),
   8px 14px 38px rgba(39,44,49,.06), 
   1px 3px 8px rgba(39,44,49,.03);
  
  &:hover {
    transform: translateY(0);
    box-shadow: inset 0 0 0 1px rgba(0,0,0,.03),
     0 0 1px rgba(39,44,49,.09), 
     0 3px 16px rgba(39,44,49,.06);
  }
  
  &:hover h4 {
    color: #0277BD;
  }
`);

const QrCodeThumbnail = styled(QRCode)`
  width: 72px;
  display: table-cell;
`;

const RoundedCheckbox = styled.div`
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid black;
  width: 56px;
  display: table-cell;
  transition: all .2s;
  background: ${props => props.selected ? '#0277BD' : 'transparent'};
`;

const ProductInfo = styled.div`
  color: rgba(11, 31, 53, .95);
  letter-spacing: 0;
  display: table-cell;
  vertical-align: top;
  padding: 0 20px;
  width: 100%;
`;

const ProductName = styled.h4`
  color: rgba(11, 31, 53, .87);
  font-size: 18px;
  margin: 0;
  padding-bottom: 10px;
  width: 100%;
`;

const ProductSecondary = styled.div`
  color: rgba(11, 31, 53, .54);
  font-size: 14px;
  margin-top: 4px;
`;


export default ({ name, uid, history_len, history }) => (
  <ProductCard onClick={() => history.push(`/products/${uid}`)}>
    <QrCodeThumbnail value={uid} renderAs='svg' size={72} />
    <ProductInfo>
      <ProductName>{name}</ProductName>
      <ProductSecondary><b>Идентификатор:</b> {uid}</ProductSecondary>
      <ProductSecondary><b>Транзакций:</b> {history_len}</ProductSecondary>
    </ProductInfo>
    <RoundedCheckbox />
  </ProductCard>
);