import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import IceContainer from '@icedesign/container';
import { Grid ,Tree,Button,Icon,Dialog,Message } from '@alifd/next';
import FilterTable from './components/FilterTable'
import OrgForm from './components/OrgForm'
import Modal from '../../components/Modal'
import $model from '@root/api.js'
import OrgTree from '@root/orgTree.js'
const { Row, Col } = Grid;
const TreeNode = Tree.Node;
export default class Staff extends Component {
  constructor(props) {
    super(props);
    this.state = {
			orgTree:[],
			addOrModify:'add',
			selectNode:null,//被选中的
			roleList:[]
		};
		this.getOrg = this.getOrg.bind(this) ;
		this.onSelect = this.onSelect.bind(this);
		this.editOrg = this.editOrg.bind(this);
		this.deleteOrg = this.deleteOrg.bind(this);
		this.addOrg = this.addOrg.bind(this);
		this.sumbitOrg = this.sumbitOrg.bind(this) ;
		
  }
	componentDidMount(){
		this.getOrg() ;
		this.getRoles() ;
	}
	
	async getOrg(){
		let result = await OrgTree.data() ;
		this.setState({
			orgTree: result
		})
	}
	
	getRoles = ()=> {
		$model.getRoles().then(i=>{
			this.setState({
				roleList:i.data
			})
		})
	}
	
	
	onSelect(keys, info) {
		let {label,pid,value} = info.node.props
    this.setState({
			selectNode:{name:label,pid,id:value}
		},()=>{
			console.log(this.state.selectNode) ;
		})
		
		// //获取员工数据
		// $model.getEmployee({OrgId:keys[0]})
  }
	
	addOrg() {
		this.setState({
			addOrModify:'add'
		})
		this.child.open();
	}
	editOrg() {
		if(this.state.selectNode){
			this.setState({
				addOrModify:'modify'
			})
			this.child.open();
		}
	}
	deleteOrg() {
    Dialog.confirm({
        title: '提示',
        content: `确认删除<${this.state.selectNode.name}> ?`,
        onOk: () => {
					$model.deleteOrg({id:this.state.selectNode.id}).then(i=>{
						Message.success('删除成功');
						this.getOrg() ;
						this.setState({
							selectNode:null
						})
					})
				},
        onCancel: () => console.log('cancel')
    })
	}
	sumbitOrg() {
		//完成操作关闭弹框，并且刷新树结构
		this.getOrg() ;
		this.child.onClose();
	}

  render() {
		const breadcrumb = [
		  { text: '员工管理', link: '' },
		];
		const styles = {
			h2:{
				marginTop:'0',
				textAlign:'left',
				display:'flex',
				justifyContent: 'space-between',
				alignItems: 'center'
			}
		}
    return (
			<div className="project-page">
			  <CustomBreadcrumb dataSource={breadcrumb} />
				<Modal ref="modal" title={this.state.addOrModify=='add'?'添加部门':'编辑部门'} onRef={(ref)=>{this.child = ref}} noButton>
					<OrgForm
						addOrModify={this.state.addOrModify}
						org={this.state.selectNode}
						orgTree={this.state.orgTree}
						submit={this.sumbitOrg}
					></OrgForm>
				</Modal>
			  <Row>
					<Col fixedSpan="15" style={{marginRight:'20px',overflow:'auto'}}>
						<IceContainer>
							<h2 style={styles.h2}>
								<span>组织架构</span>
								{this.state.selectNode && this.state.selectNode.pid !=-1?(
									<Button.Group>
										<Button size="small" onClick={this.addOrg}><Icon type="add" /></Button> 
										<Button size="small" onClick={this.editOrg}><Icon type="edit" /></Button>
										<Button size="small" onClick={this.deleteOrg}><Icon type="ashbin" /></Button>
									</Button.Group>
								):(
									<Button.Group>
										<Button size="small" onClick={this.addOrg}><Icon type="add" /></Button> 
									</Button.Group>
								)}
								
							</h2>
							{this.state.orgTree.length>0?(
								<Tree
									defaultExpandedKeys={['0']}
									showLine
									selectable
									isLabelBlock
									onSelect={this.onSelect}
									dataSource={this.state.orgTree}
								>
								</Tree>
							):null}
						</IceContainer>
					</Col>
					<Col>
						<FilterTable roleList={this.state.roleList} orgTree={this.state.orgTree} orgId={this.state.selectNode?this.state.selectNode.id:0}/>
					</Col>	
				</Row>
				
				
			</div>
		)
  }
}
