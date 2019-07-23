import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import IceContainer from '@icedesign/container';
import { Grid,Timeline,Select,Form, Input,TreeSelect,Message ,Button,Dialog } from '@alifd/next';
import OrgTree from '@root/orgTree.js'
import $model from '@root/api.js'
import { md5 } from 'md5js';
const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;
@withRouter
export default class StaffAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
			value: {
			  "name": "",
				"phone": "",
				"orgId": '',
				"roleId": null,
				"account": "",
				"password": ""
			},
			id:this.props.location.search.split("=")[1]||'',
			orgTree:[],
			roleList:[]
		};
		this.formChange = this.formChange.bind(this) ;
		this.getOrg = this.getOrg.bind(this) ;
		this.getRoles = this.getRoles.bind(this) ;
		this.submit = this.submit.bind(this) ;
		this.getEmployeeDetail = this.getEmployeeDetail.bind(this) ;
		//this.freezeEmployee = this.freezeEmployee.bind(this)
		
  }
  
	componentDidMount(){
		this.getOrg() ;
		this.getRoles() ;
		//alert(this.state.id)
		if(this.state.id){
			this.getEmployeeDetail()
		}
	}
	formChange(value) {
	  this.setState({
	    value
	  });
	}
	//解冻或者冻结账号
	freezeEmployee=()=>{
		$model.freezeEmployee({id:this.state.id }).then(i=>{
			Message.success(this.state.value.enabled?'已冻结':'已解冻')
			this.props.history.goBack()
		})
	}
	//删除员工共
	deleteEmployee=()=>{
		 Dialog.confirm({
        title: '删除员工',
        content: `确认删除员工<${this.state.value.name}>?`,
        onOk: () => {
					$model.deleteEmployee({id:this.state.id}).then(i=>{
						Message.success('已删除')
						this.props.history.goBack()
					})
				},
        onCancel: () => console.log('cancel')
     });
		
	}
	getEmployeeDetail() {
		$model.employeeDetail({id:this.state.id}).then(i=>{
			this.setState({
				value:{...this.state.value,...i.data}
			})
		})
	}
	getRoles() {
		$model.getRoles().then(i=>{
			this.setState({
				roleList:i.data
			})
		})
	}
	async getOrg(){
		let result = await OrgTree.data() ;
		this.setState({
			orgTree: result
		})
	}
	submit(val,errors) {
		this.setState({
			value:{...val}
		})
		if(!this.state.value.id){//新增
			val.password = md5(val.account+'123',32).toUpperCase()
		}
		if(!errors){
			$model[this.state.value.id?'modifyEmployee':'addEmloyee']({...val}).then(i=>{
				Message.success(this.state.value.id?'编辑成功':'添加成功')
				this.props.history.goBack()
			})
		}
	}
	
	//验证手机号
	checkPhone(rule, value, callback) {
		if(/^1[3456789]\d{9}$/.test(value)){
			callback()
		} else{
			callback('请输入正确的手机号')
		}
		
  }
  render() {
		const breadcrumb = [
		  { text: '员工管理', link: '#/staff' },
		  { text: this.state.value.id?'编辑员工':'新增员工', link: '' },
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
		
		
    return (
			
      <div className="project-page">
			  <CustomBreadcrumb dataSource={breadcrumb} />
        {/* 筛选和表格组合 */}
				<IceContainer>
					<h2 style={styles.h2}>{this.state.value.id?'编辑员工':'新增员工'}</h2>
					<Form 
						value={this.state.value}
						onChange={this.formChange}
					>
						<Row>
							<Col span="6">
								<FormItem label="员工姓名:" required requiredMessage="请输入员工姓名">
									<Input placeholder="请输入员工姓名" name="name"/>
								</FormItem>
							</Col>
							<Col span="6" offset="1">
								<FormItem validator={this.checkPhone.bind(this)} label="手机号码:" required requiredMessage="请输入员工手机号">
									<Input placeholder="输入手机号" name="phone" maxLength={11}/>
								</FormItem>
							</Col>
							<Col span="6" offset="1">
								<FormItem label="员工归属:" required requiredMessage="请选择员工所属部门">
									<TreeSelect name="orgId" treeDefaultExpandAll dataSource={this.state.orgTree} style={{ width: '100%',overflow:'auto' }} />
								</FormItem>
							</Col>
						</Row>
						
						<Row>
							<Col span="6">
								<FormItem label="员工角色:" required requiredMessage="请选择员工角色">
									<Select style={{width:"100%"}} name="roleId" onChange={()=>{}} onBlur={()=>{}} onToggleHighlightItem={()=>{}}>
										<Option value=''>全部</Option>
										{this.state.roleList.length>0?(
											this.state.roleList.map(i=>{
												return <Option key={i.id} value={i.id}>{i.name}</Option>
											})
										):null}
									</Select>
								</FormItem>
							</Col>
							<Col span="6" offset="1">
								<FormItem label="App登录账号:" required requiredMessage="请设置App登录账号">
									<Input disabled={this.state.value.id} placeholder="输入app登录账号" name="account"/>
								</FormItem>
							</Col>
							<Col span="6" offset="1">
								<FormItem label="初始密码:">
									{this.state.value.account}123
								</FormItem>
							</Col>
						</Row>
						
						<FormItem style={{marginTop:"50px"}}>
							{
								this.state.value.id? <Button type="primary" warning={this.state.value.enabled} onClick={this.freezeEmployee} style={{marginRight:'20px'}}>{this.state.value.enabled?'冻结账号':'恢复账号'}</Button>:null
							}
							{
								this.state.value.id?<Button type="primary" warning style={{marginRight:'50px'}} onClick={this.deleteEmployee}>删除</Button>:null
							}
							<Form.Submit validate type="primary" onClick={this.submit}>提交</Form.Submit>
							<Form.Reset style={{marginLeft: 20}} onClick={()=>{this.props.history.goBack()}}>取消</Form.Reset>
						</FormItem>
					
					</Form>
				</IceContainer>
      </div>
			
    );
  }
}
