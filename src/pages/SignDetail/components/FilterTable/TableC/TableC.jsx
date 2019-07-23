import React, { Component } from 'react';
import {Table,Pagination  } from '@alifd/next';
import IceLabel from '@icedesign/label';

const TableC = props => {
	const render = (value, index, record) => {
		let url = `#/staffAdd?id=${record.id}`
		return (
		<React.Fragment>
			<a href={url}>编辑</a> | <a href="javascript:;">重置密码</a>
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
	
	return (
		<React.Fragment>
				<Table 
				  dataSource={props.dataSource}
					hasBorder={false}
					loading={props.loading}
				>
					<Table.Column title="员工姓名" dataIndex="empName"/>
					<Table.Column title="归属" dataIndex="orgName"/>
					<Table.Column title="签到时间" dataIndex="createTime"/>
				</Table>
		</React.Fragment>
	);
	
}
export default TableC