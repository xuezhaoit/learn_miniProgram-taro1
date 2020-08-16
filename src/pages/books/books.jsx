import React, { Component } from 'react'
import { View, Button, Text, Input } from '@tarojs/components'
import { observer, inject } from 'mobx-react'
import { AtButton, AtList, AtListItem } from 'taro-ui'


import './books.scss'


@inject('store')
@observer
class books extends Component {
 
  constructor(prop){
    super(prop)
    this.state = {
      type:process.env.TARO_ENV,
      todus:['吃饭','睡觉','学习'],
      val:''
    }
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  increment = () => {
    const { bookStore } = this.props.store
    
  }

  decrement = () => {
    const { bookStore } = this.props.store
  }

  incrementAsync = () => {
    const { bookStore } = this.props.store
  }

  handleInput = (e) =>{
    console.log(11111)
    console.log(e);
    this.setState({
      val:e.target.value  
    })
  }

  handleClick = () =>{
    let { bookStore } = this.props.store
    console.log(bookStore);
    bookStore.addTodu(this.state.val)
    // console.log(this.state.val)

    // this.setState({
    //   todus:[...this.state.todus,this.state.val]
    // })
  }

  render () {
    let todus = this.state.todus
    let { bookStore } = this.props.store
    console.log(bookStore);
    let tep = bookStore.todus.map((item,index)=>{
      let temp = {}
      console.log(item);
      // temp = (<View className='books' >
      // <Text>{index+1}--{item}</Text>
      // </View> )
      temp= (
        <AtListItem isSwitch title={ item }  />
      )    
      return  temp
      
    })
    console.log(tep);
    return( 
      <view>
        <Text>521crow taro和react联系</Text>
          <Input type="text" value={this.state.val} 
          onInput={this.handleInput}
          ></Input>
          <AtButton type='primary' onClick={this.handleClick}>添加</AtButton>
          <AtList>
            { tep}
          </AtList>
          
        </view>
        )

  }
}

export default books
