import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import {Pagination,Grid  } from '@alifd/next';
import Filter from './Filter'
import TableC from './TableC'
import $model from '@root/api.js'
const { Row, Col } = Grid;
export default class FilterTable extends Component {
	
	constructor(props) {
	  super(props);
	  this.state = {
			body: {
				id:this.props.id
			},
			dataSource:[],
			dataSource1:[],
			loading:false
		}
	}
	
	query = (obj={})=> {
		this.setState({
			loading:true,
			body:{...this.state.body,...obj}
		})
		$model.getSignEmpList({...this.state.body,...obj}).then(i=>{
			this.setState({
				dataSource:i.data.signed,
				dataSource1:i.data.notSign
			})
		})
	}

	
	render(){
		const formItemLayout = {
			labelCol: {
					fixedSpan: 4
			},
			labelTextAlign:'right'
		};
		const style = {
			h2:{
				textAlign:'center',
				background:'#EBECF0',
				marginBottom:'1px',
				padding:'10px'
			}
		}
		return (
		<IceContainer>
			<Filter submit={this.query} id={this.props.id}/>
			<Row loading={this.state.loading} gutter="5">
				<Col span="12">
				  <h2 style={style.h2}>已签到人数:{this.state.dataSource.length}</h2>
					<TableC dataSource={this.state.dataSource} />
				</Col>
				<Col span="12">
					<h2 style={style.h2}>未签到人数:{this.state.dataSource1.length}</h2>
					<TableC dataSource={this.state.dataSource1} />
				</Col>
			</Row>
		</IceContainer>
		)
	}
}