// pages/index/index.js
import request from "../../utils/request.js"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendList:[],
    rankingList:[]
  },
  handleToAlbum(event){
    let index = event.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong?index='+index+'&type=playlist',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
   toRecommendPage(){
     wx.navigateTo({
       url: '/pages/recommendSong/recommendSong'
     });
   },
  onLoad: function (options) {

    // // 获取轮播图
    //   wx.request({
    //   url: 'https://whugiser.cn.utools.club/banner',
    //   data: {type:2},
    //   header: {'content-type':'application/json'},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (res)=>{
    //     this.setData({
    //       bannerList:res.data.banners
    //     })
    //   },
    // });
    // //获取每日推荐
    // wx.request({
    //   url: 'https://whugiser.cn.utools.club/personalized',
    //   data: {limit:10},
    //   header: {'content-type':'application/json'},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (res)=>{
    //     this.setData({
    //       recommendList:res.data.result
    //     })
    //   },
    // });

    // //获取热歌榜
    // let index = 0;
    // let resultArr = []
    // while(index<5){

    //   wx.request({
    //     url: 'https://whugiser.cn.utools.club/top/list',
    //     data: {idx:index++},
    //     header: {'content-type':'application/json'},
    //     method: 'GET',
    //     dataType: 'json',
    //     responseType: 'text',
    //     success: (res)=>{
    //       let rankingItem = {
    //         name:res.data.playlist.name,
    //         tracks:res.data.playlist.tracks.slice(0,3)
    //       }
    //       resultArr.push(rankingItem);
    //       this.setData({
    //         rankingList:resultArr
    //       })
    //     },
    //   });


    // }
    this.initData()
    
  },
 async initData(){
    // 获取轮播图
    let bannserRes = await request("/banner",{type:2})
    this.setData({
      bannerList:bannserRes.banners
    })

    //获取每日推荐
    let recommendRes = await request("/personalized",{limit:10})
    this.setData({
      recommendList:recommendRes.result
    })

    //获取热歌榜
    let index = 0;
    let resultArr = []
    while(index<5){
      let Rankingres = await request("/top/list",{idx:index++})
      let rankingItem = {
        name:Rankingres.playlist.name,
        tracks:Rankingres.playlist.tracks.slice(0,3)
      }
      resultArr.push(rankingItem);
      this.setData({
        rankingList:resultArr
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})