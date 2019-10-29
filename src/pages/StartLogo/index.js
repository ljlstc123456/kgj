import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import IceContainer from '@icedesign/container';
import UploadCrop from '../ProjectAdd/components/Photo/UploadCrop.jsx' ;
import $model from '@root/api.js'
const fileBaseUrl = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).fileBaseUrl+'/':'' ;
import { Button,Upload } from '@alifd/next';
@withRouter
export default class StaffAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
			value: {
				"id":"",
			  "url": "",
				"showSeconds": 3,
				"enabled": true
			},
			upload:$model.upload,
			headers:{Authorization:localStorage.getItem('kgj_token')}
		};
	
		//this.freezeEmployee = this.freezeEmployee.bind(this)
		
  }
  componentDidMount(){
  	this.getAd() 
  }
	//获取广告
	getAd = ()=>{
		$model.adList().then(i=>{
			if(i.data.length>0)
			this.setState({
				value:i.data[0]
			})
		})
	}
	
	//创建广告
	createAd = ()=>{
		$model.createAd({...this.state.value}).then(i=>{
			this.getAd() ;
		})
	}
	
	//编辑广告
	modifyAd = ()=>{
		$model.modifyAd({...this.state.value}).then() ;
	}
	
	onPreview = (info)=> {
			console.log('onPreview callback : ', info);
	}
	
	onChange = (info)=> {
			console.log('onChange callback : ', info);
	}
	
	uploadSuccess = (res, file) => {
		  this.setState({
		  	value:{...this.state.value,url:fileBaseUrl+res.data[0]}
		  },()=>{
				if(this.state.value.id !='') {
					this.modifyAd() ;
				} else {
					this.createAd() ;
				}
			})
			//console.log('onSuccess callback : ', res, file);
	}
	
	uploadError = (file)=> {
			console.log('onError callback : ', file);
	}
	
	toggleEnable = () =>{
		this.setState({
			value:{...this.state.value,enabled:!this.state.value.enabled}
		},()=>{
				this.modifyAd() ;
		})
	}
	
  render() {
		
		const styles = {
			label:{
				color:"#222"
			},
			content:{
				color:"#999"
			},
			h2:{
				marginTop:0
			},
			img:{
				'object-fit': 'contain',
				'marginRight':'10px',
				'width': '100px',
				'height': '100px',
				'border':'1px solid #ccc'
			}
		}
		
    return (
			
      <div className="project-page">
			  
        {/* 筛选和表格组合 */}
				<IceContainer style={{height:"400px"}}>
					<h2 style={styles.h2}>app启动图</h2>
					{this.state.value.url?<img style={styles.img} src={this.state.value.url} />:null}
					<UploadCrop
							action={this.state.upload+"?type=Photo"}
							style={{display: 'inline-block'}}
							onSuccess={this.uploadSuccess}
							onError={this.uploadError}
					>
					</UploadCrop>
					
					<div>
					{this.state.value.url && !this.state.value.enabled?<Button onClick={this.toggleEnable} type="primary" style={{margin: '0 0 10px'}}>启用</Button>:null}
					{this.state.value.url && this.state.value.enabled?<Button onClick={this.toggleEnable} type="primary" warning>禁用</Button>:null}
					</div>
					{/*
					<Upload
							action={this.state.upload+"?type=Photo"}
							header={{"ce":123}}
							listType="text"
							name='file'
							withCredentials={false}
							onSuccess={this.uploadSuccess}
							onError={this.uploadError}
						>
							<Button type="primary" style={{margin: '0 0 10px'}}>Upload File</Button>
					</Upload>
					*/}
				</IceContainer>
      </div>
			
    );
  }
}
