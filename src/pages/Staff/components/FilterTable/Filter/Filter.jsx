import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, DatePicker, Select, Input, Icon, Form,Grid,Upload,Message} from '@alifd/next';
import $model from '@root/api.js'
const FormItem = Form.Item;
const Option = Select.Option;
const {Row, Col} = Grid;
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14}
};
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
  }
};


const param = {
	"name": "",
	"phone": "",
	"roleId": '',
	"pageSize": 15,
	"pageIndex": 1,
	"orgId":""
}
export default class Filter extends Component {
  static displayName = 'Filter';

  constructor(props) {
    super(props);
    this.state = {
      body: {
      	...param,
				"orgId":this.props.orgId
      },
			headers:{Authorization:localStorage.getItem('kgj_token')},
			upload:$model.importStaff
    };
		this.handleSubmit = this.handleSubmit.bind(this)
		this.props.submit(this.state.body)
  }
	componentWillReceiveProps(nextProps) { // 父组件重传props时就会调用这个方法
	  if(this.state.body.orgId != nextProps.orgId){
			this.setState({
				body:{
					...param,
					"orgId":nextProps.orgId
				}
			},()=>{
				this.props.submit(this.state.body)
			})
		}
	}
  handleSubmit(v) {
		this.setState({
			body:{...v}
		})
    this.props.submit(v)
	}
	
	 onChange (value) {
    console.log(value);
   }
	 onBlur  (e) {
			console.log(/onblur/,e);
	 }

	 onToggleHighlightItem (item, type) {
			console.log(item, type);
	 }
		
	 onDownLoadExcel() {
		 $model.downLoadExcel().then(i=>{
			 let baseUrl  = JSON.parse(localStorage.getItem('userInfo')).fileBaseUrl
			 window.open(baseUrl+'/'+i.data)
		 })
	 }
	
	uploadSuccess = (obj,value)=>{
		//alert(1)
		window.location.reload()
	}
	
	uploadError = (obj,value)=>{
		console.log(obj)
		if(obj.error.status == 401){
			$model.goLogin()
			return ;
		}
		if(obj.response.error){
			Message.error(obj.response.error);
		}
	}
  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
					<Form inline value={this.state.body} style={{width:'500px'}}>
						<FormItem label="员工名称:">
								<FormItem >
										<Input name="name" placeholder="输入关键字即可"/>
								</FormItem>
						</FormItem>
					
						<FormItem label="手机号码:">
								<FormItem >
										<Input name="phone" placeholder="输入手机号"/>
								</FormItem>
						</FormItem>

						<FormItem label="员工角色:">
							<Select name='roleId' style={{width: 143}} id="basic-demo" onChange={this.onChange} onBlur={this.onBlur} onToggleHighlightItem={this.onToggleHighlightItem} defaultValue="jack" aria-label="name is" showSearch hasClear>
								<Option value=''>全部</Option>
								{this.props.roleList.length>0?(
									this.props.roleList.map(i=>{
										return <Option key={i.id} value={i.id}>{i.name}</Option>
									})
								):null}
							</Select>
						</FormItem>
					
					
		
						<FormItem>
								<Form.Submit  type="primary" onClick={this.handleSubmit}>查询</Form.Submit>
								<Form.Reset style={{margin:"0 10px"}}>重置</Form.Reset>
								<Button onClick={this.onDownLoadExcel}><Icon type="download" />下载excel模板</Button>
						</FormItem>
						

						<FormItem style={{display:'block'}} >
							<Link to='/staffAdd'><Button type="primary" style={{marginRight:'10px'}}>新增</Button></Link>
							<Upload
								action={this.state.upload}
								withCredentials={false}
								headers={this.state.headers}
								//beforeUpload={beforeUpload}
								onSuccess={this.uploadSuccess}
								onError={this.uploadError}
								style={{marginRight:'10px',display:'inline-block'}}
							>
								<Button type="primary">批量导入</Button>
							</Upload>
							<Button type="primary" onClick={this.props.openRole} style={{marginRight:'10px'}}>关联角色</Button>
							<Button type="primary" onClick={this.props.openOrg} style={{marginRight:'10px'}}>关联部门</Button>
						</FormItem>
				  </Form>
    );
  }
}

