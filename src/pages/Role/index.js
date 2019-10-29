import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import FilterTable from './components/FilterTable'
import Modal from '../../components/Modal'
import { Form, Input, Checkbox,Message,Select } from '@alifd/next';
import $model from '@root/api.js'
import {perList,debounce} from '@root/permission.js'
const FormItem = Form.Item;
const Option = Select.Option;
const { Group: CheckboxGroup } = Checkbox;

export default class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
			value:{
				"name": "",
				"description": "",
				"permissions": [],
				"statistics":'',
				"projectIds":[]
			},
			projectList:[],
			perList:perList
		};
		this.addModify = this.addModify.bind(this)
  }
	
	
	addModify(obj={"name": "","description": "","permissions": [],"projects":[],"id":'','statistics':''}) {
		let permissions = [],projectIds=[] ,projectList=[],statistics='';
		if(obj.id){
			permissions = obj.permissions.map(i=>{
				if(i.name == 'Statistics_User' || i.name == 'Statistics_Org') {
					return 'Statistics'
				}else{
					return i.name
				}
			})
			projectList = obj.projects.map(i=>{return {label:i.name,value:i.id}})
			projectIds = obj.projects.map(i=>i.id)
			statistics = (obj.permissions.filter(i=>i.name == 'Statistics_User' || i.name == 'Statistics_Org')[0]||{name:''}).name
		}
		this.setState({
			value:{...this.state.value,...obj,statistics,permissions,projectIds},
			projectList
		},()=>{
			this.child.open();
		})
	}
	
	handleSearch = (value) => {
		$model.getProjectS({name:value}).then(i=>{
			const dataSource = i.data.map(item => ({
					label: item.name, value: item.id
			}));
			this.setState({
				projectList:dataSource
			});
		})
	}
	
	formChange = (val)=>{
		this.setState({
			value:{
				...val
			}
		})
		
		//没有选择统计
		if(val.permissions.filter(i=>i=='Statistics').length<=0){
			this.setState({
				value:{
					...val,
					statistics:''
				}
			})
		}
		//没有选择转报备
		if(val.permissions.filter(i=>i=='Share').length<=0){
			this.setState({
				value:{
					...val,
					projectIds:[]
				}
			})
		}
	}
	validateAllFormField = (val,errors)=>{
		let {name,description,permissions,id,statistics,projectIds} = val ;
		console.log(val)
		this.setState({
			value:{name,description,permissions:[...permissions],id}
		})
		if(!errors){
			if(statistics){
				permissions = permissions.filter(i=>i!='Statistics');
				permissions.push(statistics)
			}
			$model[val.id?'modifyRole':'createRole']({name,description,id}).then(i=>{
				return $model.permissionRole({projectIds,permissions,roleId:val.id?val.id:i.data})
			}).then(()=>{
				Message.success('操作成功')
				this.childFT.getRole()
				this.child.onClose();
			})
		}
	}
  render() {
		const breadcrumb = [
		  { text: '角色管理', link: '' },
		];
		const formItemLayout = {
			labelCol: {
					fixedSpan: 5
			},
			labelTextAlign:'left'
		};
    return (
			
      <div className="project-page">
			  <CustomBreadcrumb dataSource={breadcrumb} />
				<FilterTable onPlus={this.addModify} onRef={(ref)=>{this.childFT = ref}}/>
				<Modal ref="modal" title="添加角色" onRef={(ref)=>{this.child = ref}} noButton>
					<Form value={this.state.value}  onChange={this.formChange} style={{width: '400px',marginTop:'20px'}} {...formItemLayout}>
						<FormItem label="角色名称:" required requiredMessage="请输入角色名称">
								<Input name="name" placeholder="请输入角色名称"/>
						</FormItem>
						<FormItem label="角色描述:" required requiredMessage="请输入角色描述">
								<Input name="description"  placeholder="请输入角色描述"/>
						</FormItem>
						<FormItem style={{width:"350px"}} label="角色权限:" labelAlign="top" required requiredMessage="请选择角色权限">
							<CheckboxGroup  name="permissions" dataSource={this.state.perList} />
						</FormItem>
						<h2>数据范围</h2>
						<FormItem asterisk={false} label="统计权限:" required={this.state.value.permissions.filter(i=>i == 'Statistics').length>0} requiredMessage="请选择统计权限">
							<Select disabled={this.state.value.permissions.filter(i=>i == 'Statistics').length<=0} placeholder="选择权限" style={{width:"100%"}} name="statistics" hasClear>
								<Option value="Statistics_User">个人</Option>
								<Option value="Statistics_Org">部门</Option>
							</Select>
						</FormItem>
						<FormItem asterisk={false} label="转报备权限:" required={this.state.value.permissions.filter(i=>i == 'Share').length>0} requiredMessage="请选择项目">
						  <Select
							  disabled={this.state.value.permissions.filter(i=>i == 'Share').length<=0}
							  style={{width:'100%','max-height':'200px','overflow':'auto'}}
							  name="projectIds"
								showSearch 
								placeholder="输入关键字搜索，可多选" 
								mode="multiple" 
								filterLocal={false} 
								dataSource={this.state.projectList} 
								onSearch={debounce(this.handleSearch,600)}
								onFocus={()=>{this.handleSearch("")}}
								/>
						</FormItem>
						<FormItem style={{textAlign:'right',marginTop:'20px',width:"100%"}}>
							<Form.Submit validate type="primary" onClick={this.validateAllFormField}>提交</Form.Submit>
						</FormItem>
				  </Form>
				</Modal>
      </div>
			
    );
  }
}
