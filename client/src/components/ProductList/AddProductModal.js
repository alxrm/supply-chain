import React, {Component} from 'react';
import {Button, Modal, ControlLabel, FormControl, InputGroup, FormGroup} from 'react-bootstrap';
import FormButton from '../Auth/FormButton';
import ExonumUtils from '../../utils/ExonumUtils';
import {ACCENT_COLOR, ACCENT_DARK} from "../../constants/configs";

export default class AddProductModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleGenerateGuid = this.handleGenerateGuid.bind(this);
    this.handleAddProduct = this.handleAddProduct.bind(this);

    this.state = {
      name: '',
      guid: '',
      secretKey: ''
    };
  }

  handleChange({ target }) {
    const { value, id } = target;

    this.setState({ [id]: value });
  }

  handleGenerateGuid() {
    this.setState({ guid: ExonumUtils.generateGuid() });
  }

  handleAddProduct() {
    const { handleClose, addProduct } = this.props;
    const { name, guid, secretKey } = this.state;

    addProduct(guid, name, secretKey);
    handleClose();

    this.setState({ name: '', guid: '', secretKey: '' });
  }

  render() {
    const { show, handleClose } = this.props;
    const { name, guid, secretKey } = this.state;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить новый товар</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <ControlLabel>Название</ControlLabel>
            <FormControl
              type="text"
              id="name"
              placeholder="Введите название товара"
              value={name}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Идентификатор товара</ControlLabel>
            <InputGroup>
              <InputGroup.Button>
                <Button onClick={this.handleGenerateGuid}>Сгенерировать</Button>
              </InputGroup.Button>
              <FormControl
                type="text"
                id="guid"
                placeholder="Введите идентификатор товара"
                value={guid}
                onChange={this.handleChange}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Секретный ключ</ControlLabel>
            <FormControl
              type="text"
              id="secretKey"
              placeholder="Введите секретный ключ"
              value={secretKey}
              onChange={this.handleChange}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <FormButton onClick={this.handleAddProduct} color={ACCENT_COLOR}>Добавить</FormButton>
          <FormButton onClick={handleClose} textColor={ACCENT_DARK} primary>Закрыть</FormButton>
        </Modal.Footer>
      </Modal>
    );
  }
}
