import React, { Component } from 'react';
import { Overlay,Icon,Button,Grid,Input,Upload,Form,Message} from '@alifd/next';
import UploadCrop from './UploadCrop.jsx' ;
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';
import Img from '@icedesign/img';
import $model from '@root/api.js'
const { Row, Col } = Grid;
const FormItem = Form.Item;
const fileBaseUrl = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).fileBaseUrl+'/':'' ;
export default class HouseType extends Component {
  constructor(props) {
    super(props);
    this.state = {
			title:"",
			upload:$model.upload,
			value:{
				"id":"",
				"name": "",
				"structureArea": "",
				"direction": "",
				"totalPrice": "",
				"downPayment": "",
				"monthlyPayment": "",
				"image": ""
			}
		}
		
  }
	
	getHouse = (id)=>{
		$model.getHouse({id}).then(i=>{
			this.setState({
				value:i.data
			})
		})
	}
	
	componentWillReceiveProps(nextProps){
		if(nextProps.id==''){
			this.setState({
				value:{
					"id":"",
					"name": "",
					"structureArea": "",
					"direction": "",
					"totalPrice": "",
					"downPayment": "",
					"monthlyPayment": "",
					"image": ""
				}
			})
		} else if(nextProps.id != this.props.id) {
			this.getHouse(nextProps.id)
		}
	}

	
	uploadSuccess = (obj,value)=>{
		//console.log(value)
		let imgs = obj.data;
		this.setState({
			value:{
				...this.state.value,
				image:imgs.pop()
			}
		})
	}
	
	uploadError = (obj,value)=>{
		if(obj.error.status == 401){
			$model.goLogin()
		}
	}
	
	submit = (val,errors) => {
		this.setState({
			value:{
				...this.state.value,
				...val
			}
		},()=>{
			if(!errors){
				//this.props.onFinish(this.state.value)
				if(this.state.value.image == '') {
					Message.error('请上传图片');
					return ;
				}
				if(this.state.value.id!=''){
					this.modifyPhoto()
				} else {
					this.createHouse()
				}
			}
		})
	}
	
	//创建户型
	createHouse = ()=>{
		$model.createHouse({...this.state.value}).then(i=>{
			this.props.onAddFinish({...this.state.value,id:i.data})
		})
	}
	
	//修改相册
	modifyPhoto = () =>{
		$model.modifyHouse({...this.state.value}).then(i=>{
			this.props.onModifyFinish({...this.state.value})
		})
	}
	
	changeValue = (value)=>{
		this.setState({
			value:{...this.state.value,...value}
		})
	}
	
	//刷新token
	refreshToken = (file, options) => {
		return {...options,headers:{Authorization:localStorage.getItem('kgj_token')}}
	}
	
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
							{this.state.value.image!=""?
								<div className={styles.imgWrap}>
									<Img
										style={{
											verticalAlign: 'middle',
										}}
										width={100}
										height={100}
										src={fileBaseUrl+''+this.state.value.image}
										type="cover"
									/>
								</div>:null
							}
				
							
							
							<UploadCrop
								action={this.state.upload+"?type=HouseType"}
								onSuccess={this.uploadSuccess}
								onError={this.uploadError}
							>
							</UploadCrop>
						</div>	
					</div> ;
		const houseType = 
					<Form value={this.state.value} onChange={this.changeValue} style={{marginTop:'10px'}} {...formItemLayout}>
						<FormItem
								label="户型名称:"
						>
							<Input placeholder="请输入，最多20个字" name="name" maxLength="20" />
						</FormItem>
						<FormItem
								label="建筑面积:"
						>
							<Input placeholder="请输入，最多10个字" name="structureArea" maxLength="10"/>
						</FormItem>
						<FormItem
								label="单价:"
						>
							<Input placeholder="请输入，最多10个字" name="direction" maxLength="10"/>
						</FormItem>
						<FormItem
								label="总价:"
						>
							<Input placeholder="请输入，最多10个字" name="totalPrice" maxLength="10"/>
						</FormItem>
						<FormItem
								label="首付:"
						>
							<Input placeholder="请输入，最多10个字" name="downPayment" maxLength="10"/>
						</FormItem>
						<FormItem
								label="月供:"
						>
							<Input placeholder="请输入，最多10个字" name="monthlyPayment" maxLength="10"/>
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
					<h3>项目户型</h3>
					<Button text iconSize="large" onClick={this.props.onClose}><Icon type="error" /></Button>
				</div>	
				<div className={styles.body}>
				{
					houseType
				}
				</div>
				{/*<div className={styles.footer}><Button type="primary" onClick={this.onOk}>确定</Button></div>	*/}
				</IceContainer>
			</Overlay>
      </div>
    );
  }
}
