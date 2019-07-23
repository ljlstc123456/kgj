import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import IceContainer from '@icedesign/container';
import FilterTable from './components/FilterTable'


export default class Custom extends Component {
  constructor(props) {
    super(props);
    this.state = {};
		//this.onSort = this.onSort.bind(this)
  }
  render() { 
		const breadcrumb = [
		  { text: '客户管理', link: '' },
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
				<FilterTable />
      </div>
			
    );
  }
}
