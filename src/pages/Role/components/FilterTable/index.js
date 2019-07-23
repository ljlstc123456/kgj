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
		this.getRole() 
	}
	
	getRole=() =>{
		this.setState({
			loading:true
		})
		$model.getRoles().then(i=>{
			this.setState({
				dataSource:i.data,
			},()=>{
				this.setState({
					loading:false
				})
			})
		})
	}

	//删除角色
	deleteRole = (obj)=>{
		Dialog.confirm({
		    title: '提示',
		    content: `确认删除<${obj.name}> ?`,
		    onOk: () => {
					$model.deleteRole({id:obj.id}).then(i=>{
						Message.success('删除成功');
						this.getRole()
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
			<TableC deleteRole={this.deleteRole} dataSource={this.state.dataSource} loading={this.state.loading} onPlus={this.props.onPlus}/>
		</IceContainer>
		)
	}
}