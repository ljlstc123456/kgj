import React, { Component } from 'react';
import {Table,Pagination  } from '@alifd/next';
import IceLabel from '@icedesign/label';
import Modal from '@root/components/Modal'
const TableC = props => {
	const render = (value, index, record) => {
		let url = `#/staffAdd?id=${record.id}`
		return (
		<React.Fragment>
			<a href={url}>编辑</a> | <a href="javascript:;" onClick={()=>{props.resetPassword(record)}}>重置密码</a>
		</React.Fragment>
		);
	};
	
	const renderState = (value, index, record) => {
		if(record.enabled){
			return <IceLabel status="success">正常</IceLabel>
		}else{
			return <IceLabel status="default">冻结</IceLabel>
		}
	}
	
	const onChange = function(args) {
		props.selectId(args)
  }
	
	return (
		<React.Fragment>
				<Table 
				  dataSource={props.dataSource}
					hasBorder={false}
					loading={props.loading}
					rowSelection={{onChange: onChange,selectedRowKeys:props.userIds}}
				>
					<Table.Column title="员工姓名" dataIndex="name"/>
					<Table.Column title="手机号"   dataIndex="phone"/>
					<Table.Column title="状态" cell={renderState}/>
					<Table.Column title="员工角色" dataIndex="roleName"/>
					<Table.Column title="员工归属" dataIndex="orgName"/>
					<Table.Column title="操作" cell={render}/>
				</Table>
		</React.Fragment>
	);
	
}
export default TableC