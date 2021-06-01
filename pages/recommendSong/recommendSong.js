// pages/recommendSong/recommendSong.js
import PubSub, { publish } from 'pubsub-js'

import request from "../../utils/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Day:"",
    Mouth:"",
    recommendList:[],
    index:""
  },
  navToDetail(event){
    let musicId = event.currentTarget.id;
    let index = event.currentTarget.dataset.index;
    this.setData({
      index:index
    })
    wx.navigateTo({
      url: '/pages/musicPlayer/musicPlayer?musicId='+musicId
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let cookies = wx.getStorageSync("cookies");
    if(!cookies){
      wx.showModal({
        title: '当前用户未登录',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        complete: ()=>{
          wx.reLaunch({
            url: '/pages/login/login',
          });
        }
      });
    }

    if("playlist"===options.type){
      this.getPlayList(options.index)
    }else{
      this.getRecommendSong()
    }


    this.setData({
      Day:(new Date()).getDate(),
      Month:(new Date()).getMonth()+1
    })

    PubSub.subscribe("SwitchMusic",(msg,type)=>{
      let {recommendList,index} = this.data;
      let musicId = "";
      if("pre"===type){
        if(index!=0){
          index --
        }else{
          index = recommendList.length - 1
        }
        musicId = recommendList[index].id
      }else{
        if(index!=(recommendList.length - 1)){
          index ++
        }else{
          index = 0
        }
        musicId = recommendList[index].id
      }

      this.setData({
        index,index
      })
      PubSub.publish("MusicId",musicId);
    })
  },

  async getPlayList(index){
    let playlist = await request("/playlist/detail",{id:index})
    this.setData({
      recommendList:playlist.result.tracks
    })
  },
  PlayAllSong(){
    let index = 0;
    this.setData({
      index:index
    })
    let musicId = this.data.recommendList[0].id
    wx.navigateTo({
      url: '/pages/musicPlayer/musicPlayer?musicId='+musicId
    });
  },
  async getRecommendSong(){
    let recommendRes = await request("/recommend/songs")
    this.setData({
      recommendList:recommendRes.recommend.slice(0,15)
    })
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