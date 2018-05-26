import React, {Component} from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode.react';
import connectWithDispatch from "../../utils/connectWithDispatch";

const Container = styled.div`
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.03),
    0 0 1px rgba(39,44,49,.09), 
    0 3px 16px rgba(39,44,49,.06);
`;

const Card = styled.div`
  display: table;
  width: 100%;
  padding: 20px;
`;

const QrCodeThumbnail = styled(QRCode)`
  width: 148px;
  display: table-cell;
`;

const Info = styled.div`
  color: rgba(11, 31, 53, .95);
  letter-spacing: 0;
  display: table-cell;
  vertical-align: top;
  padding: 0 20px;
  width: 100%;
`;

const Title = styled.h4`
  color: ${props => props.color || 'rgba(11, 31, 53, 1)'};
  font-size: ${props => props.size || '28px'};
  margin: 0;
  padding-bottom: 10px;
  width: 100%;
`;

const Secondary = styled.div`
  color: ${props => props.color || 'rgba(11, 31, 53, .8)' };
  font-size: 14px;
  margin-top: 4px;
  white-space: nowrap;
`;

class OwnerPage extends Component {
  constructor(props) {
    super(props);
    this.reloadData = this.reloadData.bind(this);
  }

  componentDidMount() {
    this.reloadData();
  }

  reloadData() {
    const { publicKey, ownerByKey, } = this.props;

    ownerByKey(publicKey)
  }

  render() {
    const { name, transactionsCount, publicKey } = this.props;

    return (
      <Container>
        <Card>
          <QrCodeThumbnail value={`owner-${publicKey}`} renderAs='svg' size={148} />
          <Info>
            <Title>{name}</Title>
            <Secondary><b>Публичный ключ:</b> {publicKey}</Secondary>
            <Secondary><b>Количество транзакций:</b> {transactionsCount}</Secondary>
          </Info>
        </Card>
      </Container>
    );
  }
}

export default connectWithDispatch(state => ({
  publicKey: state.auth.user.publicKey,
  name: state.owner.name,
  transactionsCount: state.owner.transactionsCount,
  error: state.owner.error,
}))(OwnerPage);