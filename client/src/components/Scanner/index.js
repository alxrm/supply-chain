import React, {Component} from 'react';
import styled from 'styled-components';
import connectWithDispatch from '../../utils/connectWithDispatch';
import BoldInput from '../Layout/BoldInput';
import QRCode from 'qrcode.react';

const Container = styled.div`
  padding: 6px 20px 20px;

  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .03),
    0 0 1px rgba(39, 44, 49, .09), 
    0 3px 16px rgba(39, 44, 49, .06);
`;

class ScannerPage extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      secretKey: ''
    };
  }

  handleChange(id, value) {
    this.setState({ [id]: value });
  }

  render() {
    const { publicKey } = this.props;
    const { secretKey } = this.state;

    return (
      <Container>
        <div>
          <BoldInput
            type="text"
            id="secretKey"
            placeholder="Введите секретный ключ"
            placeholdercolor="rgb(0, 0, 0, 0.8)"
            textcolor="rgb(0, 0, 0, 1)"
            bordercolor="rgb(0, 0, 0, 0.3)"
            onChange={this.handleChange}
            value={secretKey}
          />
        </div>
        {secretKey &&
        <div>
          <QRCode
            style={{ width: '100%', margin: '64px auto 18px' }}
            value={`${publicKey}_${secretKey}`}
            size={256}
            renderAs='svg'
          />
          <div style={{ textAlign: 'center' }}>
            Чтобы подключить сканер отсканируйте этот QR код с помощью приложения <b>СЧ Сканер</b>
          </div>
        </div>}
      </Container>
    );
  }
}

export default connectWithDispatch(state => ({
  publicKey: state.auth.user.publicKey,
  error: state.auth.error
}))(ScannerPage);