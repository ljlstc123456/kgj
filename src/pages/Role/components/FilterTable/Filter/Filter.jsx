import React, { Component } from 'react';
import { Button, Form} from '@alifd/next';
const FormItem = Form.Item;

export default class Filter extends Component {
  static displayName = 'Filter';

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
					<Form inline style={{width:'700px'}}>
						<FormItem style={{display:"block"}}>
								<Button type="primary" onClick={()=>{this.props.onPlus()}}>新增</Button>
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
