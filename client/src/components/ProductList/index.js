import React, {Component} from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom'
import {Button} from 'react-bootstrap';

import connectWithDispatch from '../../utils/connectWithDispatch';
import ProductUtils from '../../utils/ProductUtils';
import AddProductModal from './AddProductModal';
import ProductCard from './ProductCard';
import {NoProductsBlock, NoProductsLabel} from './NoProducts';
import FormButton from '../Auth/FormButton';
import PageTitle from '../Layout/PageTitle';
import AddToGroupModal from './AddToGroupModal';
import GroupCard from './GroupCard';
import {ACCENT_COLOR} from "../../constants/configs";
import SendGroupsModal from "./SendGroupsModal";

class ProductList extends Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleProductChecked = this.handleProductChecked.bind(this);
    this.handleGroupChecked = this.handleGroupChecked.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);

    this.state = {
      addProductModal: false,
      attachToGroupModal: false,
      sendGroupsModal: false,
      productSelections: {},
      groupSelections: {}
    };
  }

  componentDidMount() {
    this.reloadData();
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleClose(modalName) {
    return () => {
      this.setState({ [modalName]: false });
    }
  }

  handleShow(modalName) {
    return () => {
      this.setState({ [modalName]: true });
    }
  }

  handleProductChecked(uid, selected) {
    this.setState({
      productSelections: {
        ...this.state.productSelections,
        [uid]: selected
      }
    })
  }

  handleGroupChecked(uid, selected) {
    this.setState({
      groupSelections: {
        ...this.state.groupSelections,
        [uid]: selected
      }
    })
  }

  subscribe() {
    this.subscription = setInterval(this.reloadData, 1000);
  }


  unsubscribe() {
    clearInterval(this.subscription);
  }

  reloadData() {
    const { ownerProductsByKey, publicKey } = this.props;
    ownerProductsByKey(publicKey);
  }

  render() {
    const { products, history } = this.props;
    const { productSelections, groupSelections, sendGroupsModal, addProductModal, attachToGroupModal } = this.state;
    const noProducts = Object.keys(products).length === 0;
    const hasSelections = Object.values(productSelections).filter(it => it).length !== 0;
    const hasGroupSelections = Object.values(groupSelections).filter(it => it).length !== 0;
    const productsGrouped = ProductUtils.splitProductsByGroups(products);

    console.log(productsGrouped)

    return (
      <div style={{ padding: '18px 0' }}>
        <AddProductModal
          show={addProductModal}
          handleClose={this.handleClose('addProductModal')}
          {...this.props}
        />
        <AddToGroupModal
          show={attachToGroupModal}
          items={Object.keys(productSelections).filter(it => productSelections[it])}
          handleClose={this.handleClose('attachToGroupModal')}
          {...this.props}
        />
        <SendGroupsModal
          show={sendGroupsModal}
          groups={Object.keys(groupSelections).filter(it => groupSelections[it])}
          handleClose={this.handleClose('sendGroupsModal')}
          {...this.props}
        />
        {noProducts &&
        <NoProductsBlock>
          <NoProductsLabel>Товаров не найдено</NoProductsLabel>
          <FormButton color={ACCENT_COLOR} onClick={this.handleShow('addProductModal')}>Добавить товар</FormButton>
        </NoProductsBlock>}
        {!noProducts &&
        <div>
          <FormButton
            onClick={this.handleShow('addProductModal')}
            color="transparent"
            borderColor={ACCENT_COLOR}
            textColor={ACCENT_COLOR}
            fontWeight={500}
          >
            Добавить товар
          </FormButton>
          {hasSelections &&
          <FormButton
            onClick={this.handleShow('attachToGroupModal')}
            color="transparent"
            borderColor={ACCENT_COLOR}
            textColor={ACCENT_COLOR}
            fontWeight={500}
          >
            Добавить в группу
          </FormButton>}
          {hasGroupSelections &&
          <FormButton
            onClick={this.handleShow('sendGroupsModal')}
            color="transparent"
            borderColor={ACCENT_COLOR}
            textColor={ACCENT_COLOR}
            fontWeight={500}
          >
            Отправить группы
          </FormButton>}
        </div>}
        {!noProducts && productsGrouped.map(group =>
          <div key={group.groupId}>
            <GroupCard
              uid={group.groupId}
              checked={groupSelections[group.groupId]}
              onChecked={this.handleGroupChecked}
            />
            {group.products.map(product =>
              <ProductCard
                history={history}
                key={product.uid}
                checked={productSelections[product.uid]}
                onChecked={this.handleProductChecked}
                {...product} />
            )}
          </div>
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