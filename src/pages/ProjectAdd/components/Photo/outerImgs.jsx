import React, { useState,useEffect } from 'react';
import {Icon,Button } from '@alifd/next';
import UploadCrop from './UploadCrop.jsx' ;
import Img from '@icedesign/img';
import $model from '@root/api.js'
import styles from './index.module.scss';
const fileBaseUrl = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).fileBaseUrl+'/':'' ;
const OuterImgs = (props) =>{
  
  console.log(props.imgs) ;
  const [uploadUrl,setUploadUrl] = useState($model.upload) ;

  const [imgs,setImgs] = useState(props.imgs||[])

  const uploadSuccess = (obj,value)=>{
    const imgSet = new Set([...imgs,...obj.data].filter(i=>i));
    console.log(imgSet) ;
    setImgs([...imgSet])
  }

  const uploadError = (obj,value)=>{
  	if(obj.error.status == 401){
  		$model.goLogin()
  	}
  }

  const deleteImg = (url)=>{
    setImgs(imgs.filter(i=>i!=url))
  }

  useEffect(()=>{
    props.changeImg(imgs) ;
  },[imgs])
  return (<div className={styles.outerImg}>
    {imgs.map(i=>{
      return <div className={styles.img} key={i}>
        <Img
        	style={{
        		verticalAlign: 'middle',
            border:'1px solid #ccc'
        	}}
        	width={100}
        	height={100}
        	src={fileBaseUrl+''+i}
        	type="cover"
        />
        <Button text style={{color:'red',position: 'absolute',right:0,top:0,background:"#fff"}} size="large" onClick={()=>{deleteImg(i)}}>
        	<Icon type="ashbin" />
        </Button>
      </div>
    })}

    <UploadCrop
    	action={uploadUrl+"?type="+props.type}
    	style={{display: 'inline-block'}}
    	onSuccess={uploadSuccess}
    	onError={uploadError}
    >
    </UploadCrop>
  </div>)
}


export default OuterImgs
