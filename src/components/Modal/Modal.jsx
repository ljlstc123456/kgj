import React, { Component } from 'react';
import { Overlay,Icon,Button} from '@alifd/next';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';
export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
			visible:false
		};
		this.onOk = this.onOk.bind(this)
		this.onClose = this.onClose.bind(this)
  }
	componentDidMount(){
		this.props.onRef(this)
	}
	open() {
		this.setState({
			visible:true
		})
	}
	
	onClose() {
		this.setState({
			visible:false
		})
		this.props.onClose && this.props.onClose()
	}
	
	onOk() {
		this.setState({
			visible:false
		})
		this.props.onOk && this.props.onOk()
		this.props.onClose && this.props.onClose()
	}
	
  render() {
    return (
      <div>
			<Overlay 
				visible={this.state.visible}
				align="cc cc"
				hasMask
				disableScroll
				afterOpen={this.props.afterOpen}
				//onRequestClose={this.props.onClose}
				>
				<IceContainer style={{paddingTop:"0"}}>
				<div className={styles.header}>
					<h3>{this.props.title}</h3>
					<Button text iconSize="large" onClick={this.onClose}><Icon type="error" /></Button>
				</div>	
				{this.props.children}
				{this.props.noButton?null:(
					<div className={styles.footer}><Button type="primary" onClick={this.onOk}>确定</Button></div>	
				)}
				</IceContainer>
			</Overlay>
      </div>
    );
  }
}
