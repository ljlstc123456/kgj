import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import IceContainer from '@icedesign/container';
import FilterTable from './components/FilterTable'
import { withRouter } from 'react-router-dom';

@withRouter
export default class SignDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
			id:this.props.location.search.split("=")[1]||'',
		};
		//this.onSort = this.onSort.bind(this)
  }
  render() { 
		const breadcrumb = [
		  { text: '踩盘签到', link: '#/sign' },
			{ text: '签到详情', link: '' },
		];
		const styles = {
			label:{
				color:"#222"
			},
			content:{
				color:"#999"
			},
			h2:{
				marginTop:0
			}
		}
    return (
			
      <div className="project-page">
			  <CustomBreadcrumb dataSource={breadcrumb} />
				<FilterTable id={this.state.id}/>
      </div>
			
    );
  }
}
