import React, { Component } from 'react';
import {Table,Pagination,Progress   } from '@alifd/next';
import IceLabel from '@icedesign/label';
import styles from './index.module.scss';
const TableC = props => {
	const render = (value, index, record) => {
		return (<span>
			<a href='javascript:;' onClick={()=>{props.onPlus(record)}}>编辑</a>&nbsp;|&nbsp;
			<a href='javascript:;' onClick={()=>{props.toggleSignState(record.id)}}>{record.state == 'Online'?'下线':'上线'}</a>&nbsp;|&nbsp;
			<a href='javascript:;' style={{color:'red'}} onClick={()=>{props.deleteSign(record)}}>删除</a>
		</span>)	
	}

	const renderProject = (value, index, record) => {
		return (<div className={styles.project}>
			<span>签到</span>
			<div>
				<p>{record.name}</p>
				<p>{record.projects.map(i=>i.name).join(",")}</p>
			</div>
		</div>)
	}
	const renderOrg = (value, index, record) => {
		return (
				<p>{record.orgs.map(i=>i.name).join(",")}</p>
			)
	}
	const renderProgress = (value, index, record) => {
		let url = `#/signDetail?id=${record.id}`
		return (
			<div>
				<p>踩盘进度:({record.signed}/{record.total}) <a href={url}>查看</a></p>
				<Progress percent={record.signed/record.total*100} />
			</div>
		)
	}
	
	const renderState = (value, index, record) => {
		return (record.state == 'Online'?<IceLabel status="success">进行中</IceLabel>:<IceLabel status="default">已下线</IceLabel>)
	}
	return (
		<React.Fragment>
				<Table 
				  dataSource={props.dataSource}
					hasBorder={false}
					loading={props.loading}
				>
					<Table.Column title="项目" cell={renderProject}/>
					<Table.Column title="参与部门" cell={renderOrg}/>
					<Table.Column title="状态" cell={renderState}/>
					<Table.Column title="进度" cell={renderProgress}/>
					<Table.Column title="操作" cell={render}/>
				</Table>
		</React.Fragment>
	);
	
}
export default TableC