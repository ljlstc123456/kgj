import React, { Component } from 'react';
import { Form,Input,TreeSelect ,Select } from '@alifd/next';
const FormItem = Form.Item
const Option = Select.Option;
import $model from '../../../../api.js'
export default class LinkForm extends Component {
	
	constructor(props) {
	  super(props);
	  this.state = {
			value:{
				orgId:'',
				roleId:''
			}
			
		}
	}
	validateAllFormField = (val,errors)=> {
		this.setState({
			value:{...val}
		})
		if(!errors){
			this.props.submit(this.state.value)
		}
	}
	handleChange = (val)=> {
    this.setState({
    	value:{...val}
    })
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
			<Form style={{width: '400px'}} {...formItemLayout} value={this.state.value} onChange={this.handleChange}>
			  {this.props.type=='role'?(
				<FormItem label="选择角色:" required requiredMessage="请选择要关联的角色">
					<Select name='roleId' style={{width: 243}} id="basic-demo" aria-label="name is" showSearch hasClear>
						{this.props.roleList.length>0?(
							this.props.roleList.map(i=>{
								return <Option key={i.id} value={i.id}>{i.name}</Option>
							})
						):null}
					</Select>
				</FormItem>):(
				<FormItem label="选择部门:" required requiredMessage="请选择要关联的部门" style={{marginTop:'30px'}}>
					<TreeSelect name="orgId" treeDefaultExpandAll dataSource={this.props.orgTree} onChange={this.handleChange} style={{ width: '100%',overflow:'auto' }} />
				</FormItem>
				)
				}
				
				<FormItem style={{textAlign:'right',marginTop:'20px'}}>
					<Form.Submit  validate type="primary" onClick={this.validateAllFormField}>提交</Form.Submit>
				</FormItem>
			</Form>
		</React.Fragment>
		)
	}
}