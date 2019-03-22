import React from 'react';
import {inject, observer} from "mobx-react";

@inject('serialPortStore')
@observer
class SerialPortView extends React.Component {
  render() {
    return (
      <div>串口</div>
    );
  }
}

export default SerialPortView;