import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, DatePicker, Select, Input, Icon, Form,Grid} from '@alifd/next';
import $model from '@root/api.js'
const FormItem = Form.Item;
const Option = Select.Option;
const {Row, Col} = Grid;
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14}
};
export default class Filter extends Component {
  static displayName = 'Filter';

  constructor(props) {
    super(props);
    this.state = {
      body: {
				"projectId": "",
				"empName": ""
      },
			projectList:[]
    };
		
		this.getProject()
		
  }
	
	getProject = ()=> {
		$model.getActivityProject({id:this.props.id}).then(i=>{
			this.setState({
				projectList:i.data,
				body:{...this.state.body,projectId:i.data[0].id}
			},()=>{
				this.props.submit(this.state.body)
			})
		})
	}

  handleSubmit =(v)=> {
		this.setState({
			body:{...v}
		})
    this.props.submit(v)
	}
	
  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
					<Form inline value={this.state.body} style={{width:'600px'}}>
						<FormItem label="项目名称:">
								<Select name='projectId' style={{width: 143}}   hasClear>
									{this.state.projectList.length>0?(
										this.state.projectList.map(i=>{
											return <Option key={i.id} value={i.id}>{i.name}</Option>
										})
									):null}
								</Select>
						</FormItem>
					
						<FormItem label="员工名称:">
							<Input name="empName" placeholder=""/>
						</FormItem>
					
						<FormItem>
								<Form.Submit  type="primary" style={{marginRight:"10px"}} onClick={this.handleSubmit}>查询</Form.Submit>
								<Form.Reset >重置</Form.Reset>
						</FormItem>
				  </Form>
    );
  }
}

const styles = {
  tableFilter: {
    display: 'flex',
    background: '#fff',
    padding: '20px 0',
    marginBottom: '20px',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '15px',
  },
  submitButton: {
    marginLeft: '15px',
  },
};
