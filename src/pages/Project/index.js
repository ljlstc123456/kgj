import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import IceContainer from '@icedesign/container';
import FilterTable from './components/FilterTable'

export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
 
  render() {
		const breadcrumb = [
		  { text: '项目管理', link: '' }
		];
    return (
			
      <div className="project-page">
			  <CustomBreadcrumb dataSource={breadcrumb} />
        {/* 筛选和表格组合 */}
				<IceContainer>
					<FilterTable />
				</IceContainer>
      </div>
			
    );
  }
}
