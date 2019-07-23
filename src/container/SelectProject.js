import React, { Component } from 'react';
import { Select  } from '@alifd/next';
import $model from '@root/api.js'

	export class SelectProject extends Component {
		constructor(props) {
			super(props);
			this.state = {
				projectList:[]
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
		clearSearch = (val)=>{
			console.log(val)
			// this.setState({
			// 	projectList:[],
			// 	value:{...this.state.value,projectIds:[]}
			// });
		}
		render(){
			return <React.Fragment>
				<Select
				  style={{width:'100%'}}
				  name="projectIds"
					showSearch 
					placeholder="输入关键字搜索" 
					mode="multiple" 
					filterLocal={false} 
					dataSource={this.state.projectList} 
					onSearch={this.handleSearch}
					onChange={this.clearSearch}/>
			</React.Fragment>
		}
	}
