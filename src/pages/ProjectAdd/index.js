import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import Map from './components/Map';
import Photo from './components/Photo';
import HouseType from './components/Photo/HouseType';
import IceContainer from '@icedesign/container';
import IcePanel from '@icedesign/panel';
import { Grid, Form, Input, Select,Button, DatePicker, Icon,Dialog,Message } from '@alifd/next';
import Img from '@icedesign/img';
import styles from './index.module.scss';
import $model from '@root/api.js';
// import BraftEditor from './components/BraftEditor';
const {AutoComplete} = Select;
const FormItem = Form.Item;
const { Row, Col } = Grid;
const Option = Select.Option;
const fileBaseUrl = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).fileBaseUrl+'/':'' ;
@withRouter
export default class ProjectAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
			projectId:this.props.location.search.split("=")[1]||'',
			visibleMap:false,
			visiblePhoto:false,
			visibleHouse:false,
			areaList:[],
			houseType:[],
			houseId:'',
			photoId: '',
			photo:[],
			baseProject: {
				"name": "",
				"propertyTypes": [],
				"areaCode": '',
				"averagePrice": "",
				"coordinate": '',
				"location": "",
				"tag": "",
				"totalArea": "",
				"structureArea": "",
				"landTime": "",
				"propertyRight": "",
				"areaRange": "",
				"priceRange": "",
				"plotRate": '',
				"greeningRate": '',
				"totalBuildings": '',
				"checkOutTime": "",
				"storeyRange": "",
				"totalHouses": '',
				"propertyFee": "",
				"parkingSpotCount": '',
				"onSaleBuildings": "",
				"situation": "",
				"pooled": "",
				"developEnterprise": "",
				"propertyEnterprise": "",
				"developBank": "",
				"sellingPoint": "",
				"coupling": "",
				"reportRules": "",
				'image':''
			},
			"contacts": [
				{
					"actor": "",
					"name": "",
					"tel": ""
				}
			],
			"albumIds": [
				0
			],
			"houseTypeIds": [
				0
			]
		};
		this.onClose = this.onClose.bind(this)
		this.onOpen = this.onOpen.bind(this)
		this.validateAllFormField = this.validateAllFormField.bind(this)
		this.formChange = this.formChange.bind(this)
		this.getArea()
		
  }
	componentDidMount(){
		if(this.state.projectId){
			this.getProjectDetail()
		}
	}
	//编辑时，获取项目详情
	getProjectDetail = ()=>{
		$model.getProject({id:this.state.projectId}).then(i=>{
			this.setState({
				photo: [...i.data.albums],
				houseType: [...i.data.houseTypes],
				contacts: [...i.data.contacts],
				baseProject: {...i.data}
			})
		})
	}
	onClose(obj, key) {
		this.setState({
			[key]: false
		})
	}
	//选择地点
	mapFinish = (obj)=>{
		this.setState({
			visibleMap: false,
			baseProject:{
				...this.state.baseProject,
				coordinate:obj.lng+","+obj.lat,
				location:obj.address
			}
		})
	}
	//增加相册
	onAddFinish = (obj)=>{
		this.setState({
			visiblePhoto: false,
			photo:[...this.state.photo,obj]
		})
	}
	//修改相册
	onModifyFinish = (obj)=>{
		let photo = this.state.photo.map(i=>{
			if(i.id == obj.id){
				return obj
			} else {
				return i
			}
		})
		this.setState({
			visiblePhoto: false,
			photo
		})
	}
	//增加户型
	onAddFinishHouse = (obj)=>{
		this.setState({
			visibleHouse: false,
			houseType:[...this.state.houseType,obj]
		})
	}
	//修改户型
	onModifyFinishHouse = (obj)=>{
		let houseType = this.state.houseType.map(i=>{
			if(i.id == obj.id){
				return obj
			} else {
				return i
			}
		})
		this.setState({
			visibleHouse: false,
			houseType
		})
	}
	onOpen(key,id="") {
		this.setState({
			[key]: true,
			photoId:id
		})
	}
	
	onOpenHouse(key,id="") {
		this.setState({
			[key]: true,
			houseId:id
		})
	}
	
	getArea = ()=>{
		$model.projectArea().then(res=>{
			this.setState({
				areaList:res.data
			})
		})
	}
	
	//设置宣传图
	setImg = (url)=>{
		//alert(url)
		this.setState({
			baseProject:{...this.state.baseProject,image:url}
		})
	}
	//删除相册
	deletePhoto = (obj) =>{
		Dialog.confirm({
		    title: '提示',
		    content: `确认删除<${obj.name}> ?`,
		    onOk: () => {
					$model.deleteAlbum({id:obj.id}).then(i=>{
						Message.success('删除成功');
						let imgs = this.state.photo.map(i=>{
							return i.id == obj.id?null:i
						}).filter(i=>i)
						this.setState({
							photo:imgs
						})
					})
				},
		    onCancel: () => console.log('cancel')
		})
	}
	
	//删除户型
	deleteHouse = (obj) =>{
		Dialog.confirm({
		    title: '提示',
		    content: `确认删除<${obj.name}> ?`,
		    onOk: () => {
					$model.deleteAlbum({id:obj.id}).then(i=>{
						Message.success('删除成功');
						let imgs = this.state.houseType.map(i=>{
							return i.id == obj.id?null:i
						}).filter(i=>i)
						this.setState({
							houseType:imgs
						})
					})
				},
		    onCancel: () => console.log('cancel')
		})
	}
	validateAllFormField(val,errors) {
		this.setState({
			baseProject:{...val}
		})
		
		if(!errors){
			if(this.state.photo.length<=0) {
				Message.error('请上传相册')
			}
			if(this.state.houseType.length<=0) {
				Message.error('请上传户型图')
			}
			let param = {
				projectId:this.state.projectId,
				baseProject:{...this.state.baseProject,contacts:[...this.state.contacts]},
				albumIds:this.state.photo.map(i=>i.id),
				houseTypeIds:this.state.houseType.map(i=>i.id)
			}
			console.log(param)
			$model[this.state.projectId?'modifyProject':'createProject'](param).then(i=>{
				Message.success(this.state.projectId?'修改成功':'添加成功')
				this.props.history.goBack()
			})
			
		}
		
	}
	formChange(value) {
	  this.setState({
	    baseProject:{...this.state.baseProject,...value}
	  });
	}
	changeContact = (index,key,value)=>{
		let contacts = [...this.state.contacts]
		contacts[index][key] = value;
		this.setContacts(contacts)
	}
	setContacts = (contacts)=>{
		this.setState({
			contacts
		})
	}
	//增加现场联系人
	addContacts = ()=>{
		let contacts = [...this.state.contacts,{
							"actor": "",
							"name": "",
							"tel": ""
						}]
		this.setContacts(contacts)
	}
	//删除现场联系人
	deleteContacts = (index)=>{
		let contacts = this.state.contacts.map((v,i)=>{
			if(i == index) {
				return null
			} else {
				return v
			}
		}).filter(i=>i)
		this.setContacts(contacts)
	}
  render() {
  	const breadcrumb = [
  	  { text: '项目管理', link: '#/project' },
  	  { text: '新增项目', link: '' }
  	];
		const roledataSource = [
		    '销售经理',
		    '销售主管',
		    '置业顾问',
				'项目驻场'
		];
		const onChange = function (value) {
			console.log(value);
		};
		const onBlur = function (e) {
			console.log(/onblur/,e);
		};

		const onToggleHighlightItem = function (item, type) {
			console.log(item, type);
		};
		
		const dataSource = [
			{value: '10001', label: '新盘'},
			{value: 10002, label: '地铁房'},
			{value: 10003, label: '采光好'}
		];
    return (
      <div className="project-page">
  		  <CustomBreadcrumb dataSource={breadcrumb} />
        {/* 筛选和表格组合 */}
				<Form 
					value={this.state.baseProject} 
					onChange={this.formChange}
				>
					<IcePanel status="info" style={{marginBottom: '20px'}}>
						<IcePanel.Header className={styles.header}>
							项目信息
						</IcePanel.Header>
						<IcePanel.Body>
							<Row>
								<Col span="6">
									<FormItem label="项目名称:" required requiredMessage="必填">
											<Input placeholder="请输入，中英文，最多15字" name="name" maxLength="15" hasClear/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="物业类型:" required requiredMessage="必填">
										<Select placeholder="请选择，住宅/商铺/写字楼（可多选）" style={{width:"100%"}} mode="multiple" name="propertyTypes" hasClear>
											<Option value="Business">商业</Option>
											<Option value="Dwelling">住宅</Option>
											<Option value="Office">办公楼</Option>
										</Select>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="所在区域:" required requiredMessage="必填">
										<Select name="areaCode" placeholder="请选择" style={{width:"100%"}} hasClear>
										{
											this.state.areaList.map(i=>{
												return <Option key={i.code} value={i.code}>{i.name}</Option>
											})
										}
										</Select>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="6">
									<FormItem label="均价:" required requiredMessage="必填">
										<Input placeholder="请输入，最多20字" name="averagePrice" hasClear maxLength="20"/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="项目坐标:" required requiredMessage="必填">
											<Input onClick={()=>{this.onOpen('visibleMap')}} placeholder="点击选择坐标" name="coordinate"/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="项目地址:" required requiredMessage="必填">
											<Input placeholder="请输入项目地址" name="location"/>
									</FormItem>
								</Col>
							</Row>
							
							<Row>
								<Col span="6">
									<FormItem label="项目标签:" required requiredMessage="必填">
										<Input placeholder="请输入,最多6个字" name="tag" maxLength="6" />
									</FormItem>
								</Col>
								
							</Row>
						</IcePanel.Body>
					</IcePanel>
					
					<IcePanel status="info" style={{marginBottom: '10px'}}>
						<IcePanel.Header className={styles.header}>
							基础信息
						</IcePanel.Header>
						<IcePanel.Body>
							<Row>
								<Col span="6">
									<FormItem label="占地面积:" required requiredMessage="必填">
										<Input addonTextAfter="㎡" placeholder="请输入数字" maxLength="20" name="totalArea" />
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="建筑面积:" required requiredMessage="必填">
										<Input addonTextAfter="㎡" placeholder="请输入数字" maxLength="20" name="structureArea" />
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="拿地时间:" required requiredMessage="必填">
										<DatePicker placeholder="请选择" style={{width:"100%"}} name="landTime" />
									</FormItem>
								</Col>
							</Row>
							
							<Row>
								<Col span="6">
									<FormItem label="产权:" required requiredMessage="必填">
										<Select placeholder="请选择，40年/70年" style={{width:"100%"}} name="propertyRight" hasClear>
											<Option value="Forty">四十年</Option>
											<Option value="Seventy">七十年</Option>
										</Select>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="面积区间:" required requiredMessage="必填">
										<Input placeholder="请输入，20字以内" maxLength="20" name="areaRange"/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="价格区间:" required requiredMessage="必填">
										<Input placeholder="请输入，20字以内" maxLength="20" name="priceRange"/>
									</FormItem>
								</Col>
							</Row>
							
							<Row>
								<Col span="6">
									<FormItem label="容积率:" required requiredMessage="必填">
										<Input placeholder="请输入，20字以内" maxLength="20" name="plotRate" />
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="绿化率:" required requiredMessage="必填">
										<Input addonTextAfter="%" placeholder="请输入，20字以内" maxLength="20" name="greeningRate"/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="总栋数:" required requiredMessage="必填">
										<Input addonTextAfter="栋" placeholder="请输入，20字以内" maxLength="20" name="totalBuildings"/>
									</FormItem>
								</Col>
							</Row>
							
							<Row>
								<Col span="6">
									<FormItem label="交房时间:" required requiredMessage="必填">
										<DatePicker placeholder="请选择" style={{width:"100%"}}  name="checkOutTime"/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="层高区间:" required requiredMessage="必填">
										<Input addonTextAfter="米" placeholder="请输入，20字以内" maxLength="20" name="storeyRange"  />
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="总户数:" required requiredMessage="必填">
										<Input addonTextAfter="户" placeholder="请输入，20字以内" maxLength="20" name="totalHouses"/>
									</FormItem>
								</Col>
							</Row>
							
							<Row>
								<Col span="6">
									<FormItem label="物业收费:"  required requiredMessage="必填">
										<Input addonTextAfter="元/平米" placeholder="请输入，20字以内" maxLength="20" name="propertyFee"/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="停车位:" required requiredMessage="必填">
										<Input addonTextAfter="个" placeholder="请输入，20字以内" maxLength="20"  name="parkingSpotCount"/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="在售楼栋:"  required requiredMessage="必填">
										<Input placeholder="请输入，50字以内" maxLength="50" name="onSaleBuildings"/>
									</FormItem>
								</Col>
							</Row>
							
							<Row>
								<Col span="6">
									<FormItem label="项目现状:"  required requiredMessage="必填">
										<Input placeholder="请输入，20字以内" maxLength="20" name="situation"/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="公摊:"  required requiredMessage="必填">
										<Input addonTextAfter="%" placeholder="请输入，20字以内" maxLength="20" name="pooled"/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="开发企业:"  required requiredMessage="必填">
										<Input placeholder="请输入，50字以内" maxLength="50" name="developEnterprise"/>
									</FormItem>
								</Col>
							</Row>
							
							<Row>
								<Col span="6">
									<FormItem label="物业企业:"  required requiredMessage="必填">
										<Input placeholder="请输入，50字以内" maxLength="50" name="propertyEnterprise"/>
									</FormItem>
								</Col>
								<Col span="6" offset="1">
									<FormItem label="按揭银行:"  required requiredMessage="必填">
										<Input placeholder="请输入，50字以内" maxLength="50" name="developBank"/>
									</FormItem>
								</Col>
								
							</Row>
							
						</IcePanel.Body>
					</IcePanel>
					
					<IcePanel status="info" style={{marginBottom: '20px',minHeight:'200px'}}>
						<IcePanel.Header className={styles.header}>
							项目相册
							<Button type="primary" onClick={()=>{this.onOpen('visiblePhoto')}}>新增</Button>
						</IcePanel.Header>
						<IcePanel.Body className={styles.imgContain}>
						{this.state.photo.map(i=>{
							return (
								<div className={styles.wrap}>
									<div>
										<Img
											width={250}
											height={200}
											src={fileBaseUrl+''+i.faceImage}
											type="cover"
										/>
										<h2>
											<span>{i.name}</span>
											<div>
												<Button text size="large" type="primary" onClick={()=>{this.onOpen('visiblePhoto',i.id)}}>
													<Icon type="edit" />
												</Button>
												<Button text style={{color:'red',marginLeft:'10px'}} size="large" onClick={()=>{this.deletePhoto(i)}}>
													<Icon type="ashbin" />
												</Button>
											</div>
										</h2>
										{/*<p>建面74平米 朝向东北</p>*/}
									</div>
								</div>	
							)
						})}
						</IcePanel.Body>
					</IcePanel>
					
					<IcePanel status="info" style={{marginBottom: '20px',minHeight:'200px'}}>
						<IcePanel.Header className={styles.header}>
							户型信息
							<Button type="primary" onClick={()=>{this.onOpenHouse('visibleHouse')}}>新增</Button>
						</IcePanel.Header>
						<IcePanel.Body className={styles.imgContain}>
						{this.state.houseType.map(i=>{
							return (
								<div className={styles.wrap}>
									<div>
										<Img
											width={250}
											height={200}
											src={fileBaseUrl+''+i.image}
											type="cover"
										/>
										<h2>
											<span>{i.name}</span>
											<div>
												<Button text size="large" type="primary" onClick={()=>{this.onOpenHouse('visibleHouse',i.id)}}>
													<Icon type="edit" />
												</Button>
												<Button text style={{color:'red',marginLeft:'10px'}} size="large" onClick={()=>{this.deleteHouse(i)}}>
													<Icon type="ashbin" />
												</Button>
											</div>
										</h2>
										<p>建面{i.structureArea} 朝向{i.direction}</p>
									</div>
								</div>	
							)
						})}
						</IcePanel.Body>
					</IcePanel>
					
					<IcePanel status="info" style={{marginBottom: '20px'}}>
						<IcePanel.Header className={styles.header}>
							项目卖点
						</IcePanel.Header>
						<IcePanel.Body>
						<FormItem>
						  <Input.TextArea name="sellingPoint"/>
						</FormItem>
						</IcePanel.Body>
					</IcePanel>
					
					<IcePanel status="info" style={{marginBottom: '20px'}}>
						<IcePanel.Header className={styles.header}>
							周边配套
						</IcePanel.Header>
						<IcePanel.Body>
						<FormItem>
						  <Input.TextArea name="coupling"/>
						</FormItem>
						</IcePanel.Body>
					</IcePanel>
					
					<IcePanel status="info" style={{marginBottom: '20px'}}>
						<IcePanel.Header className={styles.header}>
							<div><span style={{color:"#FF3000",fontSize:'12px'}}>*</span>报备规则</div>
						</IcePanel.Header>
						<IcePanel.Body>
						<FormItem  required requiredMessage="必填">
						  <Input.TextArea name="reportRules"/>
						</FormItem>
						</IcePanel.Body>
					</IcePanel>
					
					<IcePanel status="info" style={{marginBottom: '20px'}}>
						<IcePanel.Header className={styles.header}>
							联系现场
						</IcePanel.Header>
						<IcePanel.Body>
						{this.state.contacts.map((i,index)=>{
							return <Row gutter="20" style={{minWidth:'800px'}} key={index}>
								<Col span="4">
									<FormItem >
										<AutoComplete
											placeholder="角色"
											style={{width:"100%"}}
											value={this.state.contacts[index].actor}
											onChange={(v)=>{this.changeContact(index,'actor', v)}}
											dataSource={roledataSource} />
									</FormItem>
								</Col>
								<Col span="4">
									<FormItem >
											<Input 
											 value={this.state.contacts[index].name}
											 onChange={(v)=>{this.changeContact(index,'name', v)}}
											 placeholder="姓名" />
									</FormItem>
								</Col>
								<Col span="4">
									<FormItem >
											<Input
												value={this.state.contacts[index].tel}
												onChange={(v)=>{this.changeContact(index,'tel', v)}}
												placeholder="电话号"
											/>
									</FormItem>
								</Col>
								<Col span="4">
								{(index>0||this.state.contacts.length>1)?<a href="javascript:;" onClick={()=>{this.deleteContacts(index)}} style={{color:"red"}}>
										<Icon type="minus" />
									</a>:null}
								{index >= this.state.contacts.length - 1?<a href="javascript:;" onClick={this.addContacts}>
										<Icon type="add" />
									</a>:null}
								</Col>
							</Row>
						})}
						</IcePanel.Body>
					</IcePanel>
					
					<FormItem>
						<Form.Submit validate type="primary" onClick={this.validateAllFormField}>提交</Form.Submit>
					</FormItem>
					<Map 
						visible={this.state.visibleMap}
						onFinish={this.mapFinish}
						onClose={()=>{this.onClose({},'visibleMap')}}
					/>
					
					<Photo 
						visible={this.state.visiblePhoto}
						image={this.state.baseProject.image}
						setImg={this.setImg}
						id={this.state.photoId}
						onClose={()=>{this.onClose({},'visiblePhoto')}}
						onAddFinish={this.onAddFinish}
						onModifyFinish={this.onModifyFinish}
					/>
					
					<HouseType
						visible={this.state.visibleHouse}
						id={this.state.houseId}
						onClose={()=>{this.onClose({},'visibleHouse')}}
						onAddFinish={this.onAddFinishHouse}
						onModifyFinish={this.onModifyFinishHouse}
					
					/>
				</Form>
      </div>
  		
    );
  }
}
