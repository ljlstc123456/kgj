import React, { Component } from 'react';
import {Upload,Message,Dialog,Loading} from '@alifd/next';
import Cropper from 'react-cropper';
import styles from './index.module.scss';

function convertBase64UrlToFile(urlData) {
		
    const bytes = window.atob(urlData.split(',')[1]);

    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    const blob = new Blob([ab], {type: 'image/png'});

    return new File([blob], 'test.png', {type: 'image/png'});
}

export default class UploadCrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
			src:'',
			visible:false,
			loading:false,
			size:0
		}
		
		this.uploader = new Upload.Uploader({
			action: this.props.action,
			headers:{Authorization:localStorage.getItem('kgj_token')},
			onSuccess: (arg)=>{
				this.setState({
					loading:false
				})
				this.props.onSuccess(arg)
			},
			name: 'file',
			withCredentials:false,
			onError:this.props.onError
		});
  }
	
	
	
	onSelect = (files) => {	
		this.setState({
			loading:true
		})
		const reader = new FileReader();
		reader.onload = () => {
			this.zipImg(reader.result,(base64)=>{
				const file = this.blobFile(base64);
				// start upload
				this.uploader.startUpload(file);
			},files[0].size/1000/1024)
				// this.setState({
				// 		src: reader.result,
				// 		visible: true,
				// 		loading: false,
				// 		size:files[0].size/1000/1024
				// });
		};
		reader.readAsDataURL(files[0]);
	};
	
	//压缩图片在1000像素以下
	zipImg = (data,cb,level)=>{
		var img = new Image();
		img.src = data;
		img.onload = ()=> {
			var that = img;
			// 默认按比例压缩
			var w = that.width,
					h = that.height,
			 	 scale = w / h;
			// if(!level){
			// 	w = w<1000?w:w/2;
			// 	h = w / scale;
			// }
			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			// 创建属性节点
			var anw = document.createAttribute("width");
			anw.nodeValue = w;
			var anh = document.createAttribute("height");
			anh.nodeValue = h;
			canvas.setAttributeNode(anw);
			canvas.setAttributeNode(anh);
			ctx.drawImage(that, 0, 0, w, h);
			
			//计算裁剪之后的大小，然后决定压缩比例
			var base64 = canvas.toDataURL();
			cb(canvas.toDataURL('image/jpeg', this.zipLevel(level)))
		}
	} ;
	// 
	onOkCrop = () => {
			
				const canvas = this.cropperRef.getCroppedCanvas() ;
				//先获取裁剪后的图片
				const data = canvas.toDataURL('image/jpeg', this.zipLevel());
				
				this.setState({
						visible: false
				});
				// //然后把裁剪后的图片在缩放尺寸，并且压缩质量
				// this.zipImg(data,(base64)=>{
				const file = this.blobFile(data);
				// start upload
				this.uploader.startUpload(file);
			// })
	};
	blobFile = (base64)=>{
		const blob = convertBase64UrlToFile(base64);
		return new File([blob], 'test.png', {type: 'image/png'});
	} ;
	//压缩质量
	zipLevel = (size)=>{
		let quality = 1;
		//图片200k以内不压缩
    if(size<=0.2){
       quality = 1;
    }else if(size>1&&size<=2){
       quality = 0.6;
    }else if(size>2&&size<=3){
       quality = 0.5;
    }else if(size>3&&size<=4){
       quality = 0.4;
    }else if(size>4&&size<=6){
       quality = 0.2;
    }else{
       quality = 0.1;
    }
		
		return quality;
	}
	saveCropperrRef = (ref) => {
		this.cropperRef = ref;
	};
	onCancel = () => {
		this.setState({
			visible: false
		});
	};
  render() {
		return (<React.Fragment>
			<Loading 
				visible={this.state.loading}
				shape="fusion-reactor"
				safeNode={this.btn}
			>
				<Upload.Selecter
					onSelect={this.onSelect}
					className={styles.crop}
					>
					点击上传
				</Upload.Selecter>
			</Loading>
			{/* <Dialog
						visible={this.state.visible}
						onCancel={this.onCancel}
						onOk={this.onOkCrop}
						onClose={this.onCancel}
						title="裁剪要缩"
						isFullScreen>
						<Cropper
								ref={this.saveCropperrRef}
								src={this.state.src}
								guides={true}
								autoCropArea={1}
								style={{height: 400, width: 600}}
						/>
			</Dialog>*/}
		</React.Fragment>)
  }
}
