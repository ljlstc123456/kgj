/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Input, Button, Checkbox, Message } from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/foundation-symbol';
import $model from '../../api.js'
import { md5 } from 'md5js';
// root,a123456
// admin,a123456
@withRouter
class UserLogin extends Component {
  static displayName = 'UserLogin';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        username: localStorage.getItem('account')||"",
        password: localStorage.getItem('account')?"******":"",
      },
			loading:false,
			checkbox: localStorage.getItem('account')?true:false,
    };
  }
  componentDidMount(){
		
	}
  formChange = (value) => {
    this.setState({
      value,
    });
  };
	handleChange = (checked) =>{
		this.setState({
			checkbox:checked
		})
	}
  handleSubmit = (e) => {
    e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
			
			this.setState({
				loading:true
			})
			$model.login({
				account: values.username,
				password: values.password == "******"?localStorage.getItem("password"):md5(values.password,32).toUpperCase()
			}).then(i=>{
				if(this.state.checkbox) {
					localStorage.setItem('account',values.username)
					localStorage.setItem('password',values.password == "******"?localStorage.getItem("password"):md5(values.password,32).toUpperCase())
				}else{
					localStorage.removeItem('account')
					localStorage.removeItem('password')
				}
				
				Message.success('登录成功')
				$model.setAuth(i.data)
				$model.loginInfo().then((v)=>{
					localStorage.setItem('userInfo',JSON.stringify(v.data))
					this.props.history.push('/project')
				})
			}).catch(()=>{
				this.setState({
					loading:false
				})
			})
			return false;
      //
      //
    });
  };
	
  render() {
    return (
      <div style={styles.container}>
        <h4 style={styles.title}>登 录</h4>
        <IceFormBinderWrapper
          value={this.state.value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formItems}>
            <div style={styles.formItem}>
              <IceIcon type="person" size="small" style={styles.inputIcon} />
              <IceFormBinder name="username" required message="必填">
                <Input
                  size="large"
                  maxLength={20}
                  placeholder="用户名"
                  style={styles.inputCol}
                />
              </IceFormBinder>
              <IceFormError name="username" />
            </div>

            <div style={styles.formItem}>
              <IceIcon type="lock" size="small" style={styles.inputIcon} />
              <IceFormBinder name="password" required message="必填">
                <Input
                  size="large"
                  htmlType="password"
                  placeholder="密码"
                  style={styles.inputCol}
                />
              </IceFormBinder>
              <IceFormError name="password" />
            </div>

            <div style={styles.formItem}>
               <Checkbox onChange={this.handleChange} checked={this.state.checkbox} style={styles.checkbox}>记住账号</Checkbox>
            </div>

            <div style={styles.footer}>
              <Button
                type="primary"
                size="large"
								loading={this.state.loading}
                onClick={this.handleSubmit}
                style={styles.submitBtn}
              >
                登 录
              </Button>
							{/*
              <Link to="/user/register" style={styles.tips}>
                立即注册
              </Link>
							*/}
            </div>
          </div>
        </IceFormBinderWrapper>
      </div>
    );
  }
}

const styles = {
  container: {
    width: '400px',
    padding: '40px',
    background: '#fff',
    borderRadius: '6px',
  },
  title: {
    margin: '0 0 40px',
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '28px',
    fontWeight: '500',
    textAlign: 'center',
  },
  formItem: {
    position: 'relative',
    marginBottom: '20px',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '12px',
    color: '#666',
  },
  inputCol: {
    width: '100%',
    paddingLeft: '20px',
  },
  submitBtn: {
    width: '100%',
  },
  tips: {
    marginTop: '20px',
    display: 'block',
    textAlign: 'center',
  },
};

export default UserLogin;
