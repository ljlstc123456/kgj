import React, { Component } from 'react';
import { Form,Input,TreeSelect  } from '@alifd/next';
const FormItem = Form.Item
import $model from '../../../../api.js'
export default class OrgForm extends Component {
	
	constructor(props) {
	  super(props);
	  this.state = {
			value: {
			  name: this.props.addOrModify=='modify'?this.props.org.name:'',
			  pid: this.props.addOrModify=='modify'?this.props.org.pid:this.props.org.id
			},
		}
		this.handleChange = this.handleChange.bind(this)
		this.validateAllFormField = this.validateAllFormField.bind(this)
	}
	validateAllFormField(val,errors) {
		this.setState({
			value:{...val}
		})
		if(!errors){
			//修改部门
			if(this.props.addOrModify=='modify') {
				$model.modifyOrg({...val,id:this.props.org.id}).then(i=>{
					this.props.submit()
				})
			} else {
				//新增部门
				$model.addOrg({...val}).then(i=>{
					this.props.submit()
				})
			}
			
			
		}
	}
	handleChange(value, data) {
    console.log(value, data);
  }
	render(){
		const formItemLayout = {
			labelCol: {
					fixedSpan: 4
			},
			labelTextAlign:'right'
		};
		return (
		<React.Fragment>
			<Form style={{width: '400px'}} {...formItemLayout} value={this.state.value} >
				<FormItem label="部门名称:" required requiredMessage="请填写部门名称">
					<Input name="name" placeholder="输入部门名称"/>
				</FormItem>
				<FormItem label="上级部门:" required requiredMessage="请选择上级部门" style={{marginTop:'30px'}}>
					<TreeSelect name="pid" treeDefaultExpandAll dataSource={this.props.orgTree} onChange={this.handleChange} style={{ width: '100%',overflow:'auto' }} />
				</FormItem>
				
				<FormItem style={{textAlign:'right',marginTop:'20px'}}>
					<Form.Submit  validate type="primary" onClick={this.validateAllFormField}>提交</Form.Submit>
				</FormItem>
			</Form>
		</React.Fragment>
		)
	}
}