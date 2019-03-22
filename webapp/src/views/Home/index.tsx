import React from 'react';
import {RouteComponentProps} from "react-router";
import styled from 'styled-components';

interface IState {
  showDropdown: 'toolType' | 'none'
}

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

const Dropdown = styled.div`
`;

const DropdownMenu = styled.div`
  position: absolute;
`;

class HomeView extends React.Component<RouteComponentProps, IState> {
  state: IState = {
    showDropdown: 'none'
  }
  handleHideDropdown = () => {
    if (this.state.showDropdown != 'none') {
      this.setState({
        showDropdown: 'none'
      });
    }
  }
  handleShowToolTypeDropdown = () => {
    this.setState({
      showDropdown: 'toolType'
    })
  }
  render() {
    const {showDropdown} = this.state;
    return (
      <div onClick={this.handleHideDropdown}>
        <AppBar>
          <Title>toolbox</Title>
          <Dropdown>
            <span onClick={this.handleShowToolTypeDropdown}>111</span>
            {showDropdown == 'toolType'
              ? <DropdownMenu>
                  <div>1</div>
                  <div>2</div>
                </DropdownMenu>
              : null
            }
          </Dropdown>
        </AppBar>
        <Content>
          <History>
            历史
          </History>
          <WorkPanel>
            工作区
          </WorkPanel>
        </Content>
      </div>
    );
  }
}

export default HomeView;