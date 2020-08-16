import { observable } from 'mobx'
import Taro from '@tarojs/taro'

const booksStore = observable({
  todus: ['吃饭','睡觉','taro'],
  
  addTodu(item){
    this.todus.push(item)
  },
  removeTodu(i) {
    Taro.showLoading({
        title:'删除中'
    })
    setTimeout(() => {
        this.todus.slice(i,1)
        Taro.hideLoading()
    }, 1000)
  }
})

export default booksStore