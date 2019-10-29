import React, { Component } from 'react';
import {Table,Pagination  } from '@alifd/next';
import IceLabel from '@icedesign/label';

const TableC = props => {
	const render = (value, index, record) => {
		return (<span>
			<a href='javascript:;' onClick={()=>{props.onPlus(record)}}>编辑</a>&nbsp;|&nbsp;
			<a href='javascript:;' style={{color:'red'}} onClick={()=>{props.deleteRole(record)}}>删除</a>
		</span>)	
	};
	
	const renderPermission = (value, index, record) => {
		return <span>{record.permissions.map(i=>i.description).join(",")}</span>
	};
	
	const renderProject = (value, index, record) => {
		return <span>{record.projects.map(i=>i.name).join(",")}</span>
	};
	
	return (
		<React.Fragment>
				<Table 
				  dataSource={props.dataSource}
					hasBorder={false}
					loading={props.loading}
				>
					<Table.Column width={200} title="角色名称" dataIndex="name"/>
					<Table.Column width={150} title="角色描述"   dataIndex="description"/>
					<Table.Column width={300} title="关联权限" cell={renderPermission}/>
					<Table.Column title="转报备权限" cell={renderProject}/>
					<Table.Column width={100} title="操作" cell={render}/>
				</Table>
		</React.Fragment>
	);
	
}
export default TableC