import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import Filter from './Filter'
import TableC from './TableC'
import { Dialog ,Message} from '@alifd/next';
import $model from '../../../../api.js'
export default class FilterTable extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
			dataSource:[],
			total:0,
			loading:false
		}
		
	}
	componentDidMount(){
		this.props.onRef(this)
		this.getSign() ;
	}
	
	getSign=() =>{
		this.setState({
			loading:true
		})
		$model.getSignList().then(i=>{
			this.setState({
				dataSource:i.data,
			},()=>{
				this.setState({
					loading:false
				})
			})
		})
	}
	
	//修改活动状态
	toggleSignState = (id)=>{
		$model.toggleSignState({id}).then(i=>{
			this.getSign()
		})
	}
	//删除活动
	deleteSign = (obj)=>{
		Dialog.confirm({
		    title: '提示',
		    content: `确认删除<${obj.name}> ?`,
		    onOk: () => {
					$model.deleteSign({id:obj.id}).then(i=>{
						Message.success('删除成功');
						this.getSign()
					})
				},
		    onCancel: () => console.log('cancel')
		})
	}
	render(){
		const formItemLayout = {
			labelCol: {
					fixedSpan: 4
			},
			labelTextAlign:'right'
		};
		return (
		<IceContainer>
			<Filter onPlus={this.props.onPlus}/>
			<TableC toggleSignState={this.toggleSignState} deleteSign={this.deleteSign} dataSource={this.state.dataSource} loading={this.state.loading} onPlus={this.props.onPlus}/>
		</IceContainer>
		)
	}
}