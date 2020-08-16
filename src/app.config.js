export default {
  pages: [
    // 'pages/books/books'
    'pages/index/index',
    'pages/me/me',
    'pages/detail/detail',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    selectedColor:"#1296db",
    list: [{
      pagePath: "pages/index/index",
      text: "首页",
      iconPath: "images/home.png",
      selectedIconPath: "images/home-active.png"
    }, {
      pagePath: "pages/me/me",
      text: "我的",
      iconPath: "images/me.png",
      selectedIconPath: "images/me-active.png"
    }]
  }
}
