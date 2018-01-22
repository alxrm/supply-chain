import React, {Component} from 'react';
import styled from 'styled-components';
import { Checkbox } from 'react-bootstrap';

import connectWithDispatch from '../../utils/connectWithDispatch';

const ItemCard = styled.div`
  background-color: black;
  color: whitesmoke;
  padding: 32px;
  margin: 12px 0;
`;

class ItemList extends Component {
  constructor(props) {
    super(props);
    const { ownerItemsByKey, publicKey } = props;

    ownerItemsByKey(publicKey);
  }

  render() {
    const { items } = this.props;

    return (
      <div>
        {Object.keys(items).map(it =>
          <ItemCard key={it}>
            <div>Item: {items[it].name}</div>
            <Checkbox/>
          </ItemCard>
        )}
      </div>
    );
  }
}

export default connectWithDispatch(state => ({
  publicKey: state.auth.user.publicKey,
  items: state.ownerItems.items,
  error: state.ownerItems.error,
}))(ItemList);