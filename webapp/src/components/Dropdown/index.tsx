import React, {CSSProperties} from 'react';

export interface DropdownProps<T> {
  visible: boolean;
  onClick: (index: number) => void;
  onVisibleChange: (visible: boolean) => void;
  title: () => React.ReactNode;
  data: T[];
  renderItem: (item: T, index?: number) => React.ReactNode;
  style?: CSSProperties;
  containerStyle?: CSSProperties;
}

class Dropdown<T> extends React.PureComponent<DropdownProps<T>> {
  componentDidMount() {
    document.addEventListener('click', this.handleHide)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleHide);
  }
  handleHide = () => {
    const {visible, onVisibleChange} = this.props;
    visible && onVisibleChange(false);
  }
  handleClickShow = (event: React.MouseEvent<HTMLDivElement>) => {
    const {visible, onVisibleChange} = this.props;
    event.nativeEvent.stopImmediatePropagation();
    !visible && onVisibleChange(true);
  }
  handleItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    const {onClick, onVisibleChange} = this.props;
    onVisibleChange(false);
    onClick(index);
  }
  render() {
    const {title, visible, data, renderItem, style, containerStyle} = this.props;
    return (
      <div style={{zIndex: 1, ...style}} onClick={this.handleClickShow}>
        {title()}
        {visible && (
          <div style={{position: 'absolute', padding: 5, ...containerStyle}}>
            {data.map((item, index) => (
              <div key={index} onClick={event => this.handleItemClick(event, index)}>
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;