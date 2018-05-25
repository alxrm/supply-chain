import React, {Component} from 'react';
import {Button, Modal, ControlLabel, FormControl, InputGroup, FormGroup} from 'react-bootstrap';
import FormButton from '../Auth/FormButton';
import ExonumUtils from '../../utils/ExonumUtils';
import {ACCENT_COLOR, ACCENT_DARK} from "../../constants/configs";

export default class AddToGroupModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleGenerateGuid = this.handleGenerateGuid.bind(this);
    this.handleAdd = this.handleAdd.bind(this);

    this.state = {
      groupGuid: '',
      secretKey: ''
    };
  }

  handleChange({ target }) {
    const { value, id } = target;

    this.setState({ [id]: value });
  }

  handleGenerateGuid() {
    this.setState({ groupGuid: ExonumUtils.generateGuid() });
  }

  handleAdd() {
    const { handleClose, attachToGroup, items } = this.props;
    const { groupGuid, secretKey } = this.state;

    items.forEach(uid => attachToGroup(uid, groupGuid, secretKey));
    handleClose();

    this.setState({ groupGuid: '', secretKey: '' });
  }

  render() {
    const { show, handleClose, items } = this.props;
    const { groupGuid, secretKey } = this.state;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Сгруппировать товары: {items.length}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <ControlLabel>Идентификатор группы</ControlLabel>
            <InputGroup>
              <InputGroup.Button>
                <Button onClick={this.handleGenerateGuid}>Сгенерировать</Button>
              </InputGroup.Button>
              <FormControl
                type="text"
                id="groupGuid"
                placeholder="Введите идентификатор группы"
                value={groupGuid}
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
          <FormButton onClick={this.handleAdd} color={ACCENT_COLOR}>Добавить</FormButton>
          <FormButton onClick={handleClose} textColor={ACCENT_DARK} primary>Закрыть</FormButton>
        </Modal.Footer>
      </Modal>
    );
  }
}