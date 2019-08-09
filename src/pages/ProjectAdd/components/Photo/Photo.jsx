import React, { Component } from 'react';
import { Overlay,Icon,Button,Grid,Input,Upload,Form,Message} from '@alifd/next';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';
import UploadCrop from './UploadCrop.jsx' ;
import Img from '@icedesign/img';
import $model from '@root/api.js'
const { Row, Col } = Grid;
const FormItem = Form.Item;
const fileBaseUrl = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).fileBaseUrl+'/':'' ;

function convertBase64UrlToFile(urlData) {

    const bytes = window.atob(urlData.split(',')[1]);

    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    const blob = new Blob([ab], {type: 'image/png'});

    return new File([blob], 'test.png', {type: 'image/png'});
}

export default class Photo extends Component {
  constructor(props) {
    super(props);
		
				
    this.state = {
			title:"",
			upload:$model.upload,
			src:'',
			visible:false,
			value:{
				"id":"",
				"name": "",
				"faceImage": "",
				"images": []
			}
		}
		this.init = this.init.bind(this) ;
		this.onOk = this.onOk.bind(this) ;
  }
	
	init() {
		
	}
	
	onOk() {
		this.props.onClose({...this.state})
	}
	
	getAlbum = (id)=>{
		$model.getAlbum({id}).then(i=>{
			this.setState({
				value:i.data
			})
		})
	}
	
	
	componentWillReceiveProps(nextProps){
		if(nextProps.id=='' && nextProps.image == this.props.image){
			this.setState({
				value:{
					"id":"",
					"name": "",
					"faceImage": "",
					"images": []
				}
			})
		} else if(nextProps.id != this.props.id && nextProps.image == this.props.image) {
			this.getAlbum(nextProps.id)
		}
	}
	uploadSuccess = (obj,value)=>{
		console.log(value,obj)
		let imgs = obj.data;
		const imgSet = new Set([...this.state.value.images,...imgs].filter(i=>i));
		this.setState({
			value:{
				...this.state.value,
				images:[...imgSet],
				faceImage:[...imgSet][0]
			}
		})
	}
	uploadError = (obj,value)=>{
		if(obj.error.status == 401){
			$model.goLogin()
		}
	}
	deleteImg = (url)=>{
		let imgs = this.state.value.images.map(i=>{
			return i == url?null:i
		}).filter(i=>i)
		this.setState({
			value:{
				...this.state.value,
				images:imgs
			}
		})
	}
	changeVal = (val)=>{
		this.setState({
			value:{
				...this.state.value,
				...val
			}
		})
	}
	submit = (val,errors) => {
		this.setState({
			value:{
				...this.state.value,
				...val,
				faceImage:this.state.value.images[0]
			}
		},()=>{
			if(!errors){
				if(this.state.value.images.length <=0) {
					Message.error('请上传图片');
					return ;
				}
				//this.props.onFinish(this.state.value)
				if(this.state.value.id!=''){
					this.modifyPhoto()
				} else {
					this.createPhoto()
				}
			}
		})
	}
	
	//创建相册
	createPhoto = ()=>{
		$model.addAlbum({...this.state.value}).then(i=>{
			this.props.onAddFinish({...this.state.value,id:i.data})
		})
	}
	
	//修改相册
	modifyPhoto = () =>{
		$model.modifyAlbum({...this.state.value}).then(i=>{
			this.props.onModifyFinish({...this.state.value})
		})
	}
	
	// //刷新token
	// refreshToken = (file, options) => {
	// 	return {...options,headers:{Authorization:localStorage.getItem('kgj_token')}}
	// }
  render() {
		const formItemLayout = {
				labelCol: {
						span: 3
				},
				wrapperCol: {
						span: 10
				},
				labelTextAlign:'left'
		};
		const uploadImg = 
					<div style={{marginTop:'10px'}}>
						<span className={styles.label}>上传图片</span>
						<div style={{marginTop:'10px'}}>
							{
								this.state.value.images.map((i,index)=>{
									return (
										<div className={styles.imgWrap}>
											<Button type="normal" warning className={styles.button} onClick={()=>{this.deleteImg(i)}}><Icon type="ashbin" /></Button>
											<Img
												style={{
													verticalAlign: 'middle',
												}}
												key={i}
												width={100}
												height={100}
												src={fileBaseUrl+''+i}
												type="cover"
											/>
											{this.props.image == i?<span className={styles.topImg}>宣传图</span>:null}
											<p><a href="javascript:;" onClick={()=>this.props.setImg(i)}>设置为宣传图</a></p>
										</div>
									)
								})
							}
							
							<UploadCrop
								action={this.state.upload+"?type=Photo"}
								style={{display: 'inline-block'}}
								onSuccess={this.uploadSuccess}
								onError={this.uploadError}
							>
							</UploadCrop>
						</div>	
					</div> ;
					
		const photoForm = 
					<Form value={this.state.value} onChange={this.changeVal} style={{marginTop:'10px'}} {...formItemLayout}>
						<FormItem
								label="相册名称:"
								hasFeedback
								required
								requiredMessage="必填"
						>
								<Input placeholder="请输入，最多10个字" name="name" maxLength="10"/>
						</FormItem>
						{uploadImg}
						<div className={styles.footer}>
							<Form.Submit validate type="primary" onClick={this.submit}>提交</Form.Submit>
						</div>
					</Form> ;
    return (
      <div>
			<Overlay
				visible={this.props.visible}
				align="cc cc"
				hasMask
				disableScroll
				afterOpen={this.initMap}
				//onRequestClose={this.props.onClose}
				>
				<IceContainer style={{paddingTop:"0"}}>
				<div className={styles.header}>
					<h3>项目相册</h3>
					<Button text iconSize="large" onClick={this.props.onClose}><Icon type="error" /></Button>
				</div>	
				<div className={styles.body}>
				{photoForm}
				</div>
				{/*<div className={styles.footer}><Button type="primary" onClick={this.onOk}>确定</Button></div>	*/}
				</IceContainer>
			</Overlay>
      </div>
    );
  }
}
