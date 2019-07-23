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
				"name": "",
				"phone": "",
				"intentionProduction": "",
				"intentionLevel": "",
				"belongToName": "",
				"pageSize": 15,
				"pageIndex": 1
			}
    };
		//this.getRoles = this.getRoles.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.props.submit(this.state.body)
  }
	
	changeForm = (val)=>{
		this.setState({
			body:{...val}
		})
	}
  handleSubmit(v) {
		this.setState({
			body:{...v}
		})
    this.props.submit(v)
	}
	
	exportCustom = ()=> {
		$model.exportCustom({...this.state.body}).then(i=>{
		 let baseUrl  = JSON.parse(localStorage.getItem('userInfo')).fileBaseUrl
		 window.open(baseUrl+'/'+i.data)
		})
	}
	
  render() {
    
    return (
					<Form inline value={this.state.body} onChange={this.changeForm} style={{width:'700px'}}>
						<FormItem label="客户名称:">
								<FormItem >
										<Input name="name" placeholder="输入关键字即可"/>
								</FormItem>
						</FormItem>
					
						<FormItem label="手机号码:">
								<FormItem >
										<Input name="phone" placeholder="手机号码"/>
								</FormItem>
						</FormItem>

						
						<FormItem label="意向产品:">
							<Select name='intentionProduction' style={{width: 143}} id="basic-demo" hasClear>
								<Option value=''>全部</Option>
								<Option value="Business">商业</Option>
								<Option value="Dwelling">住宅</Option>
								<Option value="Office">办公楼</Option>
								<Option value="Other">其他</Option>
							</Select>
						</FormItem>
					
						<FormItem label="意向等级:">
							<Select name='intentionLevel' style={{width: 143}} id="basic-demo" hasClear>
								<Option value=''>全部</Option>
								<Option value="A">A级</Option>
								<Option value="B">B级</Option>
								<Option value="C">C级</Option>
								<Option value="Other">其他</Option>
							</Select>
						</FormItem>
						
						<FormItem label="客户归属:">
								<FormItem >
										<Input name="belongToName" placeholder=""/>
								</FormItem>
						</FormItem>
		
						<FormItem>
								<Form.Submit  type="primary" style={{marginRight:"10px"}} onClick={this.handleSubmit}>查询</Form.Submit>
								<Form.Reset >重置</Form.Reset>
						</FormItem>
						

						<FormItem style={{display:"block"}}>
								<Button type="primary" onClick={this.exportCustom}>导出</Button>
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
