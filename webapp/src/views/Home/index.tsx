import React from 'react';
import {Route, RouteComponentProps, Switch} from "react-router-dom";
import styled from 'styled-components';
import Dropdown from "../../components/Dropdown";
import MoreIcon from "../../components/icons/MoreIcon";
import SerialPortView from "../SerialPort";
import BluetoothView from "../Bluetooth";

const AppBar = styled.div`
  display: flex;
  align-items: center;
  background: #2b98f0;
  width: 100%;
  height: 50px;
`;

const Title = styled.span`
  font-size: 18px;
  color: #fff;
  margin: 10px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  position: absolute;
  width: 100%;
  top: 50px;
  bottom: 0px;
  left: 0px;
`;

const History = styled.div`
  background: #ffffff;
  width: 200px;
`;

const WorkPanel = styled.div`
  background: #fafafa;
  flex: 1;
  position: relative;
`;

const ToolTypeDropdownTitle = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 16px;
`;

interface IState {
  showDropdown: '串口' | undefined;
  toolType: string;
}

const ToolTypes = ['串口', '蓝牙'];

class HomeView extends React.Component<RouteComponentProps, IState> {
  state: IState = {
    showDropdown: undefined,
    toolType: ToolTypes[0]
  }
  componentDidMount() {
    const {location: {pathname}} = this.props;
    let toolType = '串口';
    if (pathname == '/bluetooth') {
      toolType = '蓝牙';
    }
    this.setState({
      toolType
    });
  }
  handleChangeToolType = (toolType: string) => {
    if (toolType == "串口") {
      this.props.history.replace('/');
    } else if (toolType == '蓝牙') {
      this.props.history.replace('/bluetooth');
    }
    this.setState({
      toolType
    });
  }
  render() {
    const {showDropdown, toolType} = this.state;
    return (
      <div style={{height: '100%'}}>
        <AppBar>
          <Title>toolbox</Title>
          <Dropdown<string>
            visible={showDropdown == '串口'}
            onVisibleChange={visible => this.setState({showDropdown: visible ? '串口' : undefined})}
            title={() => <ToolTypeDropdownTitle>{toolType}<MoreIcon width={20} height={20} fill="#fff"/></ToolTypeDropdownTitle>}
            onClick={index => this.handleChangeToolType(ToolTypes[index])}
            renderItem={(item, index) => (
              <div style={{background: '#fff', padding: '5px 10px'}}>
                {item}
              </div>
            )}
            data={ToolTypes}/>
        </AppBar>
        <Content>
          <History>
          </History>
          <WorkPanel>
            <Switch>
              <Route exact path="/" component={SerialPortView} />
              <Route path="/bluetooth" component={BluetoothView} />
            </Switch>
          </WorkPanel>
        </Content>
      </div>
    );
  }
}

export default HomeView;