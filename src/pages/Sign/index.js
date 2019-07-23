import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import FilterTable from './components/FilterTable'
import Modal from '../../components/Modal'
import OrgTree from '@root/orgTree.js'
import { Form, Input, Checkbox,Message,Select,TreeSelect } from '@alifd/next';
import $model from '@root/api.js'
import {perList,debounce} from '@root/permission.js'
const FormItem = Form.Item;
const { Group: CheckboxGroup } = Checkbox;
const Option = Select.Option
export default class Sign extends Component {
  constructor(props) {
    super(props);
    this.state = {
			value:{
				"name": "",
				"projectIds": [],
				"scope": 100,
				"orgIds":[],
				"orgTree":[]
			},
			projectList:[],
			perList:perList
		};
		this.addModify = this.addModify.bind(this)
		this.getOrg = this.getOrg.bind(this) ;
  }
	
	
	componentDidMount(){
		this.getOrg() ;
	}
	
	//增加编辑项目
	addModify(obj={"name": "","projectIds": [],"scope": 100,id:'','orgIds':[]}) {
		let projectList = []
		let projectIds = []
		let orgIds = []
		if(obj.projects && obj.projects.length>0) {
			projectList = obj.projects.map(i=>{return {label:i.name,value:i.id}})
			projectIds = obj.projects.map(i=>i.id)
		}
		
		if(obj.orgs && obj.orgs.length>0) {
			orgIds = obj.orgs.map(i=>i.id)
		}
		this.setState({
			value:{...this.state.value,...obj,projectIds,orgIds},
			projectList
		},()=>{
			this.child.open();
		})
	}
	
	validateAllFormField = (val,errors)=>{
		let {name,projectIds,scope,orgIds} = val ;
		this.setState({
			value:{name,projectIds,scope,orgIds}
		})
		if(!errors){
			$model[val.id?'modifySign':'addSign']({name,projectIds,scope,id:val.id,orgIds}).then(i=>{
				Message.success('操作成功')
				this.child.onClose();
				this.childFT.getSign();
			})
		}
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
	// clearSearch = (val)=>{
	// 	console.log(val)
	// 	// this.setState({
	// 	// 	projectList:[],
	// 	// 	value:{...this.state.value,projectIds:[]}
	// 	// });
	// }
	handerChange = (val)=>{
		this.setState({
			value:{...this.state.value,...val}
		});
	}
	
	async getOrg(){
		let result = await OrgTree.data() ;
		this.setState({
			orgTree: result
		})
	}
	
  render() {
		const breadcrumb = [
		  { text: '踩盘签到', link: '' },
		];
		const formItemLayout = {
			labelCol: {
					fixedSpan: 4
			},
			labelTextAlign:'left'
		};
    return (
      <div className="project-page">
			  <CustomBreadcrumb dataSource={breadcrumb} />
				<FilterTable onPlus={this.addModify} onRef={(ref)=>{this.childFT = ref}}/>
				<Modal ref="modal" title="新增签到" onRef={(ref)=>{this.child = ref}} noButton>
					<Form value={this.state.value} onChange={this.handerChange} style={{width: '400px',marginTop:'20px'}} {...formItemLayout}>
						<FormItem label="活动名称:" required requiredMessage="活动名称">
								<Input name="name" placeholder="请输入"/>
						</FormItem>
						<FormItem label="踩盘项目:" required requiredMessage="请选择踩盘项目">
						  <Select
							  style={{width:'100%'}}
							  name="projectIds"
								showSearch 
								placeholder="输入关键字搜索" 
								mode="multiple" 
								filterLocal={false} 
								dataSource={this.state.projectList} 
								onSearch={debounce(this.handleSearch,200)}
								onFocus={()=>{this.handleSearch("")}}
							/>
						</FormItem>
						<FormItem label="定位范围:" required requiredMessage="请输入定位范围">
								<Input name="scope"  placeholder="输入纯数字，单位m"  addonTextAfter="m"/>
						</FormItem>
						<FormItem label="参与部门:" required requiredMessage="请选择参与部门">
							<TreeSelect placeholder="请选择（可多选）" multiple name="orgIds" treeDefaultExpandAll dataSource={this.state.orgTree} style={{ width: '100%',overflow:'auto' }} />
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
