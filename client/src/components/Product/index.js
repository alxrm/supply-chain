import React, {Component} from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode.react';
import connectWithDispatch from "../../utils/connectWithDispatch";
import TransactionUtils from '../../utils/TransactionUtils';
import {TX_ATTACH_TO_GROUP_ID, TX_RECEIVE_GROUP, TX_SEND_GROUP} from '../../constants/transactions';

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

const ProductInfo = styled.div`
  color: rgba(11, 31, 53, .95);
  letter-spacing: 0;
  display: table-cell;
  vertical-align: top;
  padding: 0 20px;
  width: 100%;
`;

const TransactionInfo = styled.div`
  letter-spacing: 0;
  vertical-align: top;
  padding: 16px 20px;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
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

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.reloadData = this.reloadData.bind(this);
    this.renderTransactions = this.renderTransactions.bind(this);
  }

  componentDidMount() {
    this.reloadData();
  }

  reloadData() {
    const { match, productByUid, } = this.props;

    productByUid(match.params.uid)
  }

  renderTransactions(transactions) {
    if (!transactions) {
      return <span/>;
    }

    return transactions.map(it => (
      <div key={it.tx_hash}>
        <TransactionInfo>
          <Title size="20px">{it.name}</Title>
          <Secondary><b>Держатель:</b> {TransactionUtils.ownerOf(it)}</Secondary>
          <Secondary><b>Хеш транзакции:</b> {it.tx_hash}</Secondary>
          {(it.message_id === TX_ATTACH_TO_GROUP_ID
            || it.message_id === TX_SEND_GROUP
            || it.message_id === TX_RECEIVE_GROUP) &&
          <Secondary><b>Идентификатор партии:</b> {it.body.group}</Secondary>}
          <Secondary>
            <b>Подпись:</b> <span style={{ color: 'rgba(0, 200, 78, 1)' }}>Подтверждена</span>
          </Secondary>
          <Secondary>
            <b>Статус выполнения: </b>
            {it.execution_status ?
              <span style={{ color: 'rgba(0, 200, 78, 1)' }}>Успешно</span> :
              <span style={{ color: 'rgba(200, 0, 0, 1)' }}>Отменена</span>}
          </Secondary>
        </TransactionInfo>
      </div>
    ));
  }

  render() {
    const { product, history } = this.props;
    const { group_id, name, owner_key, transferring, uid } = product;

    return (
      <Container>
        <Card>
          <QrCodeThumbnail value={`product-${uid}`} renderAs='svg' size={148} />
          <ProductInfo>
            <Title>{name}</Title>
            <Secondary><b>Идентификатор:</b> {uid}</Secondary>
            <Secondary><b>Текущий держатель:</b> {owner_key}</Secondary>
            {!!group_id && <Secondary><b>Партия:</b> {group_id}</Secondary>}
            <Secondary><b>В пути:</b> {transferring ? 'Да' : 'Нет'}</Secondary>
          </ProductInfo>
        </Card>
        {this.renderTransactions(history)}
      </Container>
    );
  }
}

export default connectWithDispatch(state => ({
  publicKey: state.auth.user.publicKey,
  product: state.product,
  history: state.product.history,
  error: state.product.error,
}))(ProductPage);