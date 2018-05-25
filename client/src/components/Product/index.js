import React, {Component} from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode.react';
import {Button, Modal, ControlLabel, FormControl, InputGroup, FormGroup} from 'react-bootstrap';
import FormButton from '../Auth/FormButton';
import {ACCENT_COLOR, ACCENT_DARK} from "../../constants/configs";

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductUid = styled.div`
  margin: 12px;
  font-size: 18px;
  
`;

export default class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);

    this.state = {};
  }

  handleChange({ target }) {
    const { value, id } = target;

    this.setState({ [id]: value });
  }

  handleSend() {
  }

  render() {
    const { match } = this.props;
    const {} = this.state;
    const uid = match.params.uid;

    return (
      <ProductInfo>
        <QRCode value={uid} renderAs='svg' size={128} />
        <ProductUid>Product {uid}</ProductUid>
      </ProductInfo>
    );
  }
}