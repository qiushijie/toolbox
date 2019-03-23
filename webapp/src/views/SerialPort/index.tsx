import React from 'react';
import {inject, observer} from "mobx-react";
import {closeSerial, openSerial, serialIsOpen} from "../../services/SerialService";
import {RouteComponentProps} from "react-router";
import * as socket from '../../services/SocketService';

interface IState {
  open: boolean;
  name: string;
  baud: number;
  text: string;
  result: string;
}

@inject('serialPortStore')
@observer
class SerialPortView extends React.Component<RouteComponentProps, IState> {
  state: IState = {
    open: false,
    name: '/dev/tty.usbserial',
    baud: 115200,
    text: '',
    result: ''
  }
  async componentDidMount() {
    socket.addListener(socket.serialEvent, data => {
      this.setState({
        result: this.state.result + data
      });
    });
    const open = await serialIsOpen();
    this.setState({
      open
    });
  }
  componentWillMount() {
    socket.removeListener(socket.serialEvent);
  }
  handleClickOpen = async () => {
    const {open, name, baud} = this.state;
    const next = !open;
    let result = false;
    if (next) {
      result = await openSerial({name, baud});
    } else {
      result = await closeSerial();
    }
    if (result) {
      this.setState({
        open: next
      });
    }
  }
  handleSend = () => {
    const {text} = this.state;
    socket.send(socket.serialEvent, text);
  }
  render() {
    const {open, name, baud, text, result} = this.state;
    return (
      <div>
        <div onClick={this.handleClickOpen}>{open ? '关闭' : '打开'}</div>
        <div style={{background: open ? 'green' : 'red', width: 10, height :2}}></div>
        <div>
          <span>名称</span><input value={name} onChange={e => this.setState({name: e.target.value})} />
        </div>
        <div>
          <span>波特率</span><input type="number" value={baud} onChange={e => this.setState({baud: parseInt(e.target.value)})} />
        </div>
        <div>
          <span>text</span><input value={text} onChange={e => this.setState({text: e.target.value})}/>
        </div>
        <div onClick={this.handleSend}>发送</div>
        <div>
          {result}
        </div>
      </div>
    );
  }
}

export default SerialPortView;