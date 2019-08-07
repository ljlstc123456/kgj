import React, { Component } from 'react';
import {Table,Pagination  } from '@alifd/next';
import IceLabel from '@icedesign/label';

const TableC = props => {
	const render = (value, index, record) => {
		let url = `#/projectAdd?id=${record.id}`
		const modify = <a href={url}>编辑</a>
		if(record.state == 'Online'){
			return <React.Fragment>
							{modify}
							&nbsp;|&nbsp;<a href="javascript:;" onClick={()=>{props.toggleState(record.id,'Recommended')}}>设为推荐</a>
							&nbsp;|&nbsp;<a href="javascript:;" onClick={()=>{props.toggleState(record.id,'Offline')}}>下线</a>
				     </React.Fragment>
		}else if(record.state == 'Offline'){
			return <React.Fragment>
								{modify}
								&nbsp;|&nbsp;<a href="javascript:;" onClick={()=>{props.toggleState(record.id,'Online')}}>上线</a>
								&nbsp;|&nbsp;<a href="javascript:;" style={{color:'red'}} onClick={()=>{props.deleteProject(record)}}>删除</a>
							</React.Fragment>
		} else if(record.state == 'Recommended'){
			return <React.Fragment>
			    {modify}
					&nbsp;|&nbsp;<a href="javascript:;" onClick={()=>{props.toggleState(record.id,'Online')}}>取消推荐</a>
					&nbsp;|&nbsp;<a href="javascript:;" onClick={()=>{props.toggleState(record.id,'Offline')}}>下线</a>
				</React.Fragment>
		}
		
	};
	
	const renderState = (value, index, record) => {
		if(record.state == 'Online'){
			return <IceLabel status="success">已上线</IceLabel>
		}else if(record.state == 'Offline'){
			return <IceLabel status="default">已下线</IceLabel>
		} else if(record.state == 'Recommended'){
			return <IceLabel status="danger">推荐</IceLabel>
		}
	}
	
	const renderType = (value, index, record) =>{
		let txt = {
			'Business':'商业',
			'Dwelling':'住宅',
			'Office':'办公楼',
			'Other':'其他', 
			'Apartment':'公寓',
			'Villa':'别墅'
		}
		return record.propertyTypes.map(i=>{
			return txt[i]
		}).join(",")
	}
	
	return (
		<React.Fragment>
				<Table 
				  dataSource={props.dataSource}
					hasBorder={false}
					loading={props.loading}
				>
					<Table.Column title="项目姓名" dataIndex="name"/>
					<Table.Column title="地址" dataIndex="location"/>
					<Table.Column title="标签" dataIndex="tag"/>
					<Table.Column title="物业类型" cell={renderType}/>
					<Table.Column title="状态" cell={renderState}/>
					<Table.Column title="上线时间" dataIndex="upTime"/>
					<Table.Column title="操作" cell={render}/>
				</Table>
		</React.Fragment>
	);
	
}
export default TableC