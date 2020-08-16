import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Button, Text, Input,Swiper, SwiperItem } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { AtButton, AtList, AtListItem, AtCard, AtRate, AtDivider, AtTag, AtTextarea   } from 'taro-ui'

// 样式
import './detail.scss'

// 数据库
const db = wx.cloud.database()



@inject('store')
@observer
class detail extends Component {
 
  constructor(prop){
    super(prop)
    
  }

  state={
    detailData:{},
    id:'',
    comment:'',
    userInfo: Taro.getStorageSync('userInfo') || {}
  }

  componentWillMount () { 
    console.log("componentWillMount");
    let params = getCurrentInstance().router.params
    console.log(params);
    this.setState({
      id:params.id
    })
    db.collection('doubanBooks').doc(params.id).get().then(
      res =>{
        console.log(res.data);
        this.setState({
          detailData:res.data
        })
        Taro.setNavigationBarTitle({
          title: res.data.title
        })
      }
    )
  }

  componentDidMount () {
    console.log("componentDidMount");  
    
  }

  componentWillUnmount () { 
    console.log("componentWillUnmount");
  }

  componentDidShow () {
    console.log("componentDidShow");
  }

  componentDidHide () { 
    console.log("componentDidHide");
  }

  increment = () => {
    const { bookStore } = this.props.store
    
  }

  decrement = () => {
    const { bookStore } = this.props.store
  }

  incrementAsync = () => {
    const { bookStore } = this.props.store
  }

  // 评论添加方法
  handleChange (value){
    this.setState({
      comment:value
    })
  }
  // 提交评论
  commitComment = ()=>{
    let comment = this.state.comment
    let userInfo = this.state.userInfo
    let id = this.state.id
    let nickName =  userInfo.nickName || '521crow' 
    let date = new Date().toLocaleString( )
    db.collection('doubanBooks').doc(id)
    .update({
      data: {
        comments: db.command.push({
          author:nickName,
          content:comment,
          date:date
        })
      },
    })
  }
  
  render () {
    let detailData = this.state.detailData || {}
    let title = detailData.title
    let tags = detailData.tags || []
    let tagTemp = tags.map(item=>{
      return (
      <AtTag type='primary' className='atTagc' circle active='true'>{item.title}</AtTag>
      )
    }) 
    let comments = detailData.comments || []
    let commentsTemp= comments.map(item =>{
      return (
        <AtCard
          title={item.author}
        >
          {item.content}
        </AtCard>
      )
    })
    return( 
        <view>
            {/* 背景图 */}
            <view class="thumb">
              <image className="back" src={detailData.image} mode="aspectFitll" ></image>
              <image className="img" src={detailData.image} mode="aspectFit"  ></image>
            </view>
            {/* 标签 */}
            <view>
              {tagTemp}
            </view>
            {/* 内容简介 */}
            <view>
              <AtCard
                title='内容简介  · · · · · · '
              >
                {detailData.summary}
              </AtCard>
            </view>
            {/* 评论 */}
            <view>
              {commentsTemp}
            </view>
            {/* 我要写评论 */}
            <view>
                <AtCard
                  title='我要写评论  · · · · · · '
                >
                  <view>
                    <AtTextarea
                      value={this.state.comment}
                      onChange={this.handleChange.bind(this)}
                      maxLength={200}
                      placeholder='你的问题是...'
                    />
                    <AtButton type="primary" 
                          onClick={this.commitComment}
                      >提交评论 </AtButton>
                  </view>
                </AtCard>
            </view> 
        </view>
        )

  }
}

export default detail
