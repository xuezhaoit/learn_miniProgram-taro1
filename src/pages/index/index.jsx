import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Button, Text, Input,Swiper, SwiperItem } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { AtButton, AtList, AtListItem, AtCard, AtRate, AtDivider   } from 'taro-ui'

// 样式
import './index.scss'

// 数据库
const db = wx.cloud.database()



@inject('store')
@observer
class index extends Component {
 
  constructor(prop){
    super(prop)
    this.state = {
      type:process.env.TARO_ENV,
      swiperList:[],
      bookList:[],
      page:0,//当前页
      pageSize:5//每页条数
    }
  }
  componentWillMount () { 
    console.log("componentWillMount");
    this.getBookList(true)
    this.getSwiperList()
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
  // 触底函数
  onReachBottom= ()=>{
    console.log("onReachBottom...");
    this.setState({
      page: this.state.page + 1
    },()=>{
      this.getBookList()
    })
    console.log('最后一页。。。。');
  }
  // 获取图书列表
  getBookList= (init)=>{
    let time = new Date().getMinutes()
    console.log(this.state);
    Taro.showLoading({
      title: '加载中',
    })
    let pageSize = this.state.pageSize
    let page = this.state.page
    if (init ) {
      page = 0
      this.setState({
        page : 0,
      })
    }
    let offset = page*pageSize
    // 偏移量，从第几条查询
    let ret = db.collection('doubanBooks')
    // console.log(11111111111);
    if (offset>0) {
      ret = ret.skip(offset)
    }
    ret = ret.limit(pageSize)
    .orderBy('create_time', 'desc')
    .get().then(
      res =>{
        Taro.hideLoading()
        console.log(res);
        if (init) {
          this.setState({
            bookList: res.data
          })  
        } else {
          this.setState({
            bookList: [...this.state.bookList,...res.data]
          })
          
        }
      }
    )
  }

  // 获取轮播图
  getSwiperList= ()=>{
    console.log('getSwiperList...')
    db.collection('doubanBooks')
      .skip(0)
      .limit(10)
      .get().then(
        res =>{
          let imgs1 = res.data.slice(0,3)
          let imgs2 = res.data.slice(3,6)
          let imgs3 = res.data.slice(6,9)
          console.log(res);
          this.setState({
            swiperList: [imgs1,imgs2,imgs3]
          })  
          console.log('getSwiperList!!!!');
        }
    )
  }

  // 跳到详情页
  toDetailPage=(id)=>{
    console.log('toDetailPage:'+id);
    Taro.navigateTo({
      url: '/pages/detail/detail?id='+id
    })
  }





  render () {
    let {swiperList, bookList} = this.state
    console.log('123:',swiperList)
    
    let mySwiper = ( <Swiper
      className='test-h'
      indicatorColor='#999'
      indicatorActiveColor='#333'
      circular
      indicatorDots
      autoplay>
        {swiperList.map(item=>{
          // console.log('1234:',item);
          return  (
            <SwiperItem>
              {item.map(img=>{
                // console.log('abc:',img.image);
                return (
                  <image className="swiperImg" src={img.image} alt="" srcset=""/>
                )
              })}
            </SwiperItem>
          )
        })}
    </Swiper> )
   
    let myCard = (
      bookList.map(item =>{
        return (
          <view class="acard-div" onClick={  ()=> this.toDetailPage(item._id)}>
            <View className='at-row'>
              <View className='at-col at-col-9 text-over acard-font1'>{item.title}</View>
              <View className='at-col at-col-3'>
                <AtRate max={5} value={ + item.rate/2} size='15' />
              </View>
            </View>
            <AtDivider className="atDivider-div"></AtDivider>
            <view class="at-row" >
              <view class="at-col at-col-3" >
                <image class="book-img" src={item.image} mode="" lazy-load="false" />
              </view>
              <view class="at-col at-col-7 at-col__offset-1" >
                <view class="book-content">
                  { '作者: '+ item.author }
                </view>
                <view class="book-content">
                  { '出版社: '+item.publisher }
                </view>
                <view class="book-content">
                  { '单价: '+item.price }
                </view>
              </view>
            </view>
          </view>
        )
      })
        
    )
   
    return( 
        <view>
            <view>
              {mySwiper}
            </view>
            { myCard }
            <View class="h_10">
            </View>
        </view>
        )

  }
}

export default index
