// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const doubanbook = require('doubanbook')
// jquery插件
const cheerio = require('cheerio')

cloud.init()

// 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }

// 本地调试
// function getDoubankTest(isbn) {
//     console.log(isbn);
//     let url = "https://search.douban.com/book/subject_search?search_text="+isbn
//     let detailinfo = await axios.get(url)
    
// }
 
// getDoubankTest('9787508689586')
// 搜索豆瓣图书 并解析搜索结果
async function searchDoubanBook(isbn) {
  let url = "https://search.douban.com/book/subject_search?search_text="+isbn
  let serachInfo = await axios.get(url)
  let reg = /window\.__DATA__ = "(.*)"/
  if (reg.test(serachInfo.data)) {
    let serachdata_en = RegExp.$1
    let serachdata = doubanbook(serachdata_en)[0] 
    return serachdata
  } else {
    return {}
  }
}

async function getDoubank(isbn) {
  // console.log(isbn);
  let bookinfo = await searchDoubanBook(isbn)
  // console.log(bookinfo);
  let bookDetailPage = await axios.get(bookinfo.url) 
  // console.log(bookDetailPage.data);
  let $ = cheerio.load(bookDetailPage.data)
  // 图书详细信息
  let info1 = $('#info').text().split('\n').map(v=>v.trim() ).filter(v=>v)
    // console.log('图书详细信息~~~~~~~~~：',info1);
  let author = info1[1]
  let publisher = info1[2].split(':')[1]
  let price = info1[6].split(':')[1].replace(/[^0-9\.]/ig,"")

  // 标签
  let tag_arr = []
  let tag1 = $('#db-tags-section a.tag').each((i,v)=>{
    // console.log('-----------------');
    tag_arr.push({
      title:$(v).text()
    })
    // console.log($(v).text());
    
  })
  // console.log(tag_arr);
  // 评论
  let comments = []
  $("#comments .comment-item").each((i,item)=>{
    // 评论的作者
    let author = $(item).find('.comment-info a').text()
    // 评论的日期
    let date = $(item).find('.comment-info span').eq(1).text()
    let content = $(item).find('.comment-content span').text() 
    // console.log('comments~~~author~~~~~：',author);
    // console.log('comments~~~date~~~~~：',date);
    // console.log('comments~~~content~~~~~：',content);
    comments.push({
      author,
      date,
      content
  })
  })
  // console.log('comments~~~~~~~~~~~:',comments)
  let summary = $('#link-report .intro').text()
  // console.log(summary);
  let ret = {
    // 创建时间
    create_time: new Date().getTime(),
    // 标题
    title: bookinfo.title,
    // 评分
    rate: bookinfo.rating.value,
    // 图片路径
    image: bookinfo.cover_url,
    // 路径
    url: bookinfo.url,
    // 简介
    summary,
    // 标签
    tags: tag_arr,
    // 作者
    author,
    // 出版社
    publisher,
    // 单价
    price,
    // 评论
    comments
  }
  console.log(ret);
  return ret
}
// 本地调试
getDoubank('9787508689586')

// 云函数入口
exports.main= async( event, context) => {
  console.log(event); 
  console.log(context); 
  let { ibsn } = event
  return getDoubank(ibsn)
}