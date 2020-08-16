import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import unLoginPic from '../../images/unLogin.png'
import './me.scss'

const db = wx.cloud.database()

class me extends Component {
  state={
    userInfo: Taro.getStorageSync('userInfo') || {}
  }
   //获取用户信息
   onGetUserinfo = (e )=> {
    console.log(e);
    let userInfo = e.detail.userInfo 
    wx.cloud.callFunction({
      name:'login',
      complete: res => {
        userInfo.openid = res.result.openid
        console.log(userInfo);
        this.setState({
          userInfo
        })
        Taro.setStorageSync('userInfo', userInfo)
        console.log(userInfo);
      }
    })
  } 
  // 添加数据库
  insertDb(opt){
    console.log('insert-------',opt.result);
    db.collection('doubanBooks').add({
      // data 字段表示需新增的 JSON 数据
      data: opt.result
    })
    .then(res => {
      console.log(res)
      wx.showModal({
        title: '添加成功',
        content: `《 ${opt.result.title} 》添加成功`,
      })
    })
    .catch(console.error)
  }
  // 查找图书
  findBook= ( ibsn )=>{
    // 调用云函数
    console.log("findbook------------");
    wx.cloud.callFunction({
      name:'getDoubankBook',
      data:{
        ibsn:ibsn,
        agc:'123'
      },
      success: res => {
        console.log(res);
        this.insertDb(res)
        // 添加数据库
      }
    })
  }
  // 添加图书事件
  addBook = ()=>{
    // 扫码
    let opt = {
      scanType:	['barCode', 'qrCode'],	
      complete: res => {
        console.log('scanCode...');
        let errMsg = res.errMsg.split(":")
        if (errMsg[1]=="ok") {
          console.log(errMsg[1]);
          // 图书的Isbn码
          let isbn = res.result
          console.log(isbn);
          this.findBook( isbn )
        } else {
          console.log(errMsg[1]);
        }

      }
    }
    Taro.scanCode(opt)
  }
  render () {
    let userInfo = this.state.userInfo
    return (
         <View class="user-container">
           { userInfo.openid ? 
           <View>
            <View>
              <image class="avatar" src={ userInfo.avatarUrl }  />
            </View>
            <View class="" >
              { userInfo.nickName }
            </View> 
            <View >
              <AtButton type="primary" 
                  onClick={this.addBook}
              >添加图书</AtButton>
          </View>
           </View>: 
          <View>
            <View>
              <image class="avatar" src={ unLoginPic }  />
            </View>  <AtButton  className="loginButton" type='primary' size='small' 
            openType="getUserInfo"
            onGetUserInfo={this.onGetUserinfo}
            >登录</AtButton> 
          </View>
          }
          
          
         
        </View>
    )
  }
}

export default me
