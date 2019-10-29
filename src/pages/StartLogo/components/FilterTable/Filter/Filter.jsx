import React, { Component } from 'react';
import { Button, Form,Input} from '@alifd/next';
const FormItem = Form.Item;

export default class Filter extends Component {
  static displayName = 'Filter';

  constructor(props) {
    super(props);
    this.state = {
			body:{
				roleName:''
			}
      
    };
		this.handleSubmit = this.handleSubmit.bind(this) ;
  }
	
	handleSubmit(v) {
		this.setState({
			body:{...v}
		})
	  this.props.submit(v)
	}
  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
					<Form inline value={this.state.body} style={{width:'700px'}}>
						<FormItem label="角色名称:">
							<Input name="roleName" style={{width:'300px'}} placeholder="输入关键字即可" hasClear/>
						</FormItem>
						<FormItem>
								<Form.Submit  type="primary" onClick={this.handleSubmit}>查询</Form.Submit>
								<Button type="primary" style={{margin:"0 10px"}} onClick={()=>{this.props.onPlus()}}>新增</Button>
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
