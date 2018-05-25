import React, {Component} from 'react';
import {Button, Modal, ControlLabel, FormControl, InputGroup, FormGroup} from 'react-bootstrap';
import FormButton from '../Auth/FormButton';
import {ACCENT_COLOR, ACCENT_DARK} from "../../constants/configs";

export default class SendGroupsModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);

    this.state = {
      secretKey: ''
    };
  }

  handleChange({ target }) {
    const { value, id } = target;

    this.setState({ [id]: value });
  }

  handleSend() {
    const { handleClose, sendGroup, groups } = this.props;
    const { secretKey } = this.state;

    groups.forEach(uid => sendGroup(uid, secretKey));
    handleClose();

    this.setState({ secretKey: '' });
  }

  render() {
    const { show, handleClose, groups } = this.props;
    const { secretKey } = this.state;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Отправить группы: {groups.length}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <FormButton onClick={this.handleSend} color={ACCENT_COLOR}>Отправить</FormButton>
          <FormButton onClick={handleClose} textColor={ACCENT_DARK} primary>Закрыть</FormButton>
        </Modal.Footer>
      </Modal>
    );
  }
}