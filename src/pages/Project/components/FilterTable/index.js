import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import {Pagination,Dialog,Message  } from '@alifd/next';
import Filter from './Filter'
import TableC from './TableC'
import $model from '../../../../api.js'
export default class FilterTable extends Component {
	
	constructor(props) {
	  super(props);
	  this.state = {
			dataSource:[],
			total:0,
			loading:false,
			body:{pageIndex:1}
		}
		//this.getProjectList() ;
		
	}
	
	getProjectList = (obj={})=> {
		this.setState({
			loading:true,
			body:{...this.state.body,...obj}
		},()=>{
			window.projectParam = {...this.state.body}
		})
		
		$model.getProjectList({...this.state.body,...obj}).then(i=>{
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
	query = (v) => {
		this.getProjectList(v)
	}
	
	onChange = (currentPage) => {
			console.log(currentPage) ;
			this.getProjectList({pageIndex:currentPage})
	}
	
	toggleState = (id,state)=>{
		Dialog.confirm({
		    title: '提示',
		    content: `确认${state == 'Offline'?'下线项目':'上线项目'} ?`,
		    onOk: () => {
					$model.toggleState({id,state}).then(i=>{
						Message.success('操作成功');
						this.getProjectList()
					})
				},
		    onCancel: () => console.log('cancel')
		})
		
		// $model.toggleState({id,state}).then(i=>{
		// 	this.getProjectList()
		// })
	}
	
	//删除项目
	deleteProject = (record) =>{
		Dialog.confirm({
		    title: '提示',
		    content: `确认删除<${record.name}> ?`,
		    onOk: () => {
					$model.deleteProject({id:record.id}).then(i=>{
						Message.success('删除成功');
						this.getProjectList()
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
			<Filter submit={this.query}/>
			<h3>本次查询共{this.state.total}条数据</h3>
			<TableC deleteProject={this.deleteProject} dataSource={this.state.dataSource} loading={this.state.loading} toggleState={this.toggleState}/>
			{this.state.total > 0?<Pagination current={this.state.body.pageIndex} pageSize={15} total={this.state.total} style={{textAlign:'right',marginTop:'20px'}} onChange={this.onChange} className="page-demo" />:null}
		</IceContainer>
		)
	}
}