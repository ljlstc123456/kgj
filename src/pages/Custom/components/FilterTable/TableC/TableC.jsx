import React, { Component } from 'react';
import {Table,Pagination  } from '@alifd/next';
import IceLabel from '@icedesign/label';

const TableC = props => {
	const render = (value, index, record) => {
		let url = `#/customInfo?id=${record.id}`
		return (
		<React.Fragment>
			<a href={url}>客户详情</a>
		</React.Fragment>
		);
	};
	
	const renderP = (value, index, record) => {
		const txt = {
			"Business":"商业",
			"Dwelling":"住宅",
			"Office":"办公楼",
			"Other":"其他"
		}
		return record.intentionProductions.map(i=>txt[i]).join(",")
	}
	
	const renderL = (value, index, record) => {
		const txt = {
			"A":"A级",
			"B":"B级",
			"C":"C级",
			"Other":"其他"
		}
		return txt[record.intentionLevel]
	}
	
	return (
		<React.Fragment>
				<Table 
				  dataSource={props.dataSource}
					hasBorder={false}
					loading={props.loading}
				>
					<Table.Column title="客户姓名" dataIndex="name"/>
					<Table.Column title="手机号"   dataIndex="phone"/>
					<Table.Column title="意向产品" cell={renderP}/>
					<Table.Column title="意向等级" cell={renderL}/>
					<Table.Column title="客户归属" dataIndex="belongToName"/>
					<Table.Column title="添加时间" dataIndex="createTime"/>
					<Table.Column title="操作" cell={render}/>
				</Table>
		</React.Fragment>
	);
	
}
export default TableC