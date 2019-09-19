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
      body: window.projectParam ||{
      	"name": "",
      	"state": "",
				"propertyType":"",
				"areaCode":"",
      	"pageSize": 15,
      	"pageIndex": 1
      },
			areaList:[]
    };
		this.handleSubmit = this.handleSubmit.bind(this)
		this.props.submit({...this.state.body})
		this.getArea()
  }
	
	
	
	getArea = ()=>{
		$model.projectArea().then(res=>{
			this.setState({
				areaList:res.data
			})
		})
	}
	
  handleSubmit(v) {
		let v1 = {...v,pageIndex:1}
		this.setState({
			body:{...v1}
		})
    this.props.submit(v1)
	}
  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
					<Form inline value={this.state.body} style={{width:'800px'}}>
						<FormItem label="项目名称:">
								<FormItem >
										<Input name="Name" placeholder="输入关键字即可"/>
								</FormItem>
						</FormItem>
				
	
						<FormItem label="项目状态:">
							<Select name='State' style={{width: 143}} hasClear>
								<Option value=''>全部</Option>
								<Option value='Online'>已上线</Option>
								<Option value='Offline'>已下线</Option>
								<Option value='Recommended'>推荐</Option>
							</Select>
						</FormItem>
						
						<FormItem label="物业类型:">
							<Select placeholder="请选择" style={{width: 143}}  name="propertyType" hasClear>
								<Option value="Business">商业</Option>
								<Option value="Dwelling">住宅</Option>
								<Option value="Office">办公楼</Option>
								<Option value="Apartment">公寓</Option>
								<Option value="Villa">别墅</Option>
								<Option value="Other">其他</Option>
							</Select>
						</FormItem>
						
						<FormItem label="所在区域:">
							<Select name="areaCode" placeholder="请选择" style={{width: 143}} hasClear>
							{
								this.state.areaList.map(i=>{
									return <Option key={i.code} value={i.code}>{i.name}</Option>
								})
							}
							</Select>
						</FormItem>
						
						<FormItem>
								<Form.Submit  type="primary" style={{marginRight:"10px"}} onClick={this.handleSubmit}>查询</Form.Submit>
								<Form.Reset >重置</Form.Reset>
						</FormItem>
						
						<FormItem style={{display:"block"}}>
								<Link to='/projectAdd'><Button type="primary">新增</Button></Link>
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
