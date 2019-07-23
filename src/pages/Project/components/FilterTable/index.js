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
			loading:false
		}
		//this.getProjectList() ;
		
	}
	
	getProjectList = (obj={})=> {
		this.setState({
			loading:true,
			body:{...this.state.body,...obj}
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
		$model.toggleState({id,state}).then(i=>{
			this.getProjectList(this.state.param)
		})
	}
	
	//删除项目
	deleteProject = (record) =>{
		Dialog.confirm({
		    title: '提示',
		    content: `确认删除<${record.name}> ?`,
		    onOk: () => {
					$model.deleteProject({id:record.id}).then(i=>{
						Message.success('删除成功');
						this.getProjectList(this.state.param)
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
			<TableC deleteProject={this.deleteProject} dataSource={this.state.dataSource} loading={this.state.loading} toggleState={this.toggleState}/>
			{this.state.total > 0?<Pagination pageSize={15} total={this.state.total} style={{textAlign:'right',marginTop:'20px'}} onChange={this.onChange} className="page-demo" />:null}
		</IceContainer>
		)
	}
}