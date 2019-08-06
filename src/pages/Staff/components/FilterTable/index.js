import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import {Pagination,Dialog,Message  } from '@alifd/next';
import Filter from './Filter'
import TableC from './TableC'
import $model from '../../../../api.js'
import LinkForm from '../LinkForm'
import Modal from '@root/components/Modal'
export default class FilterTable extends Component {
	
	constructor(props) {
	  super(props);
	  this.state = {
			dataSource:[],
			total:0,
			type:'role',
			loading:false,
			userIds:[],
			roleList:[]
		}
		this.getEmployee = this.getEmployee.bind(this) ;
		this.query = this.query.bind(this) ;
	}
	//关联角色
	openRole = ()=>{
		if(this.state.userIds.length<=0) {
			Message.error('请选择员工') ;
			return ;
		}
		this.setState({
			type:'role'
		})
		this.child.open();
	}
	//关联部门
	openOrg = ()=>{
		if(this.state.userIds.length<=0) {
			Message.error('请选择员工') ;
			return ;
		}
		this.setState({
			type:'org'
		})
		this.child.open();
	}
	//选择员工
	selectId = (ids)=>{
		this.setState({
			userIds:ids
		})
	}
		
	resetPassword = (record)=>{
		Dialog.confirm({
		    title: '提示',
		    content: `确认重置<${record.name}> 密码? 重置后密码为"账号123"`,
		    onOk: () => {
					$model.resetPassword({id:record.id}).then(i=>{
						Message.success('重置成功');
					})
				},
		    onCancel: () => console.log('cancel')
		})
	}
	getEmployee(obj={}) {
		this.setState({
			loading:true,
			body:{...obj}
		})
		$model.getEmployee({...this.state.body,...obj}).then(i=>{
			this.setState({
				dataSource:i.data.rows,
				total:i.data.total
			},()=>{
				this.setState({
					loading:false
				})
			})
		})
	}
	query(v) {
		this.getEmployee(v)
	}
	
	submit = ({roleId,orgId})=>{
		if(this.state.type=='role'){
			$model.linkRole({roleId,userIds:this.state.userIds}).then(i=>{
				//window.location.reload()
				this.child.onClose() ;
				this.query(this.state.body) 
			})
		}
		if(this.state.type=='org'){
			$model.linkOrg({orgId,userIds:this.state.userIds}).then(i=>{
				window.location.reload()
			})
		}
	}
	
	onChange = (currentPage) => {
		this.getEmployee({pageIndex:currentPage})
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
			{/*关联角色或者部门*/}
			<Modal ref="modal" title={this.state.type=='role'?'关联角色':'关联部门'} onRef={(ref)=>{this.child = ref}} noButton>
				<LinkForm
					type={this.state.type}
				  roleList={this.props.roleList}
					orgTree={this.props.orgTree}
					submit={this.submit}
				></LinkForm>
			</Modal>
		
			<Filter openRole={this.openRole} roleList={this.props.roleList} openOrg={this.openOrg} submit={this.query} orgId={this.props.orgId}/>
			<TableC selectId={this.selectId} resetPassword={this.resetPassword} dataSource={this.state.dataSource} loading={this.state.loading}/>
			{this.state.total > 0?<Pagination pageSize={15} total={this.state.total} style={{textAlign:'right',marginTop:'20px'}} onChange={this.onChange} className="page-demo" />:null}
		</IceContainer>
		)
	}
}