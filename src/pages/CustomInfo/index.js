import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import { withRouter } from 'react-router-dom';
import IceContainer from '@icedesign/container';
import { Grid,Timeline  } from '@alifd/next';
import $model from '@root/api.js'
const { Row, Col } = Grid;
const TimelineItem = Timeline.Item;

@withRouter
export default class CustomInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
			info:{
				"id": 0,
				"name": "",
				"phone": "",
				"gender": "",
				"intentionProductions": [],
				"intentionLevel": "",
				"createTime": "",
				"belongToName":''
			},
			reports:[]
		};
		this.getInfo()
		this.getCustomerReport()
  }
	
	getInfo = ()=>{
		$model.getCustomer({id:this.props.location.search.split("=")[1]}).then(i=>{
			this.setState({
				info:i.data
			})
		})
	}
	getCustomerReport = ()=>{
		$model.getCustomerReport({id:this.props.location.search.split("=")[1]}).then(i=>{
			this.setState({
				reports:i.data
			})
		})
	}
  render() {
		const breadcrumb = [
		  { text: '客户管理', link: '#/custom' },
		  { text: '客户详情', link: '' },
		];
		const styles = {
			label:{
				color:"#222"
			},
			content:{
				color:"#999"
			},
			h2:{
				marginTop:0
			}
		}
		const {
			name,
			phone,
			gender,
			intentionProductions,
			intentionLevel,
			createTime,
			belongToName
		} = this.state.info
		
		const intentionProductionsTxt = intentionProductions.map(i=>({
			"Business":"商业",
			"Dwelling":"住宅",
			"Office":"办公楼",
			"Other":"其他"
		})[i]).join(",")
		
		const intentionLevelTxt =  ({
			"A":"A级",
			"B":"B级",
			"C":"C级",
			"Other":"其他"
		})[intentionLevel]
    return (
      <div className="project-page">
			  <CustomBreadcrumb dataSource={breadcrumb} />
        {/* 筛选和表格组合 */}
				<IceContainer>
					<h2 style={styles.h2}>客户信息</h2>
					<div style={{width:'900px',fontSize:'14px'}}>	
						<Row>
							<Col span="2" style={styles.label}>客户姓名</Col>
							<Col span="5" style={styles.content}>{name}</Col>
							<Col span="2" style={styles.label}>手机号码</Col>
							<Col span="5" style={styles.content}>{phone}</Col>
							<Col span="2" style={styles.label}>意向等级</Col>
							<Col span="5" style={styles.content}>{intentionLevelTxt}</Col>
						</Row>
						<Row style={{marginTop:'20px'}}>
							<Col span="2" style={styles.label}>意向产品</Col>
							<Col span="10" style={styles.content}>{intentionProductionsTxt}</Col>
						</Row>
						<Row style={{marginTop:'20px'}}>
							<Col span="2" style={styles.label}>客户归属</Col>
							<Col span="5" style={styles.content}>{belongToName}</Col>
							<Col span="2" style={styles.label}>添加时间</Col>
							<Col span="5" style={styles.content}>{createTime}</Col>
						</Row>
					</div>
				</IceContainer>
				<IceContainer>
					<h2 style={styles.h2}>报备记录</h2>
					<Timeline>
					  {this.state.reports.map((i,index)=>{
							return <TimelineItem key={index} title={`报备至${i.projectName}`} time={i.createTime} state="process"/>
						})}
					</Timeline>
				</IceContainer>
      </div>
			
    );
  }
}
