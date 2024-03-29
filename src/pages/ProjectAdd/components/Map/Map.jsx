import React, { Component } from 'react';
import { Overlay,Icon,Button,Form, Input } from '@alifd/next';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';
const FormItem = Form.Item;
let searMark = {
	lng:'',
	lat:''
}
export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
			lng:'',
			lat:'',
			address:''
		};
		this.initMap = this.initMap.bind(this)
		this.onOk = this.onOk.bind(this)
  }
	
	initMap() {
		var BMap = window.BMap ;
		var that = this ;
		this.map = new BMap.Map("allmap"); // 创建Map实例
		var myGeo = new BMap.Geocoder(); 
		this.map.centerAndZoom("南宁", 11); // 初始化地图,设    置中心点坐标和地图级别
		this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
		this.map.setDefaultCursor("crosshair");
		this.map.addEventListener("click",(e) => {
			myGeo.getLocation(e.point, (result)=>{
				this.setState({
					lng:searMark.lng || e.point.lng,
					lat:searMark.lat || e.point.lat,
					address:searMark.address||result.address
				},()=>{
					searMark={
						lng:'',
						lat:'',
						address:''
					}
					this.map.clearOverlays();     
					var marker = new BMap.Marker(new BMap.Point(this.state.lng, this.state.lat)); // 创建点
					this.map.addOverlay(marker);
				})
			})
			
		});
		
		//搜索组件
		this.local = new BMap.LocalSearch(this.map, {
			renderOptions:{map: this.map},
			//点击搜索结果，直接获取结果
			onMarkersSet:function(a){
				a.forEach(function(element) {
					element.marker.addEventListener("click",function(e){
						var p = element.marker.getPosition(); 
						 console.log(element) ;
						searMark = {
							lng:p.lng,
							lat:p.lat,
							address:element.address
						}
					});
				});
			}
		});
	}
		
	
	
	onOk() {
		this.props.onClose()
		this.props.onFinish({...this.state})
	}
	
	handleSubmit = (v)=> {
    this.local.search(v.key)
	}

  render() {
    return (
      <div>
			<Overlay 
				visible={this.props.visible}
				align="cc cc"
				hasMask
				disableScroll
				afterOpen={this.initMap}
				//onRequestClose={this.props.onClose}
				>
				<IceContainer style={{paddingTop:"0"}}>
				<div className={styles.header}>
					<h3>选择地址坐标</h3>
					<Button text iconSize="large" onClick={this.props.onClose}><Icon type="error" /></Button>
				</div>
				<div
					style={{
						height:'35px',
						overflow:'hidden'
					}}
				>
					<Form inline>
						<FormItem label="关键字搜索:">
								<FormItem >
									<Input name="key" placeholder="输入关键字"/>
								</FormItem>
					
						</FormItem>
									
						<FormItem label=" ">
								<Form.Submit onClick={this.handleSubmit}>搜索</Form.Submit>
						</FormItem>
					</Form>
				</div>
				<div
					id='allmap'
					style={{
						width:'800px',
						height:'600px'
					}}>
				</div>
				<div className={styles.footer}><Button type="primary" onClick={this.onOk}>确定</Button></div>	
				</IceContainer>
			</Overlay>
      </div>
    );
  }
}
