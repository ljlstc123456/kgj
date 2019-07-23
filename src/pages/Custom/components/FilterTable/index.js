import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import {Pagination  } from '@alifd/next';
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
		this.getCustomer = this.getCustomer.bind(this) ;
		this.query = this.query.bind(this) ;
		console.log("constructor") ;
		//this.getCustomer() ;
		
	}
	
	getCustomer(obj={}) {
		this.setState({
			loading:true,
			body:{...this.state.body,...obj}
		})
		$model.getCustomerList({...this.state.body,...obj}).then(i=>{
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
		this.getCustomer(v)
	}
	
	onChange = (currentPage) => {
			console.log(currentPage) ;
			this.getCustomer({pageIndex:currentPage})
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
			<TableC dataSource={this.state.dataSource} loading={this.state.loading}/>
			{this.state.total > 0?<Pagination pageSize={15} total={this.state.total} style={{textAlign:'right',marginTop:'20px'}} onChange={this.onChange} className="page-demo" />:null}
		</IceContainer>
		)
	}
}