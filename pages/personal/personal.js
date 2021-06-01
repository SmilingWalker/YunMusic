// pages/personal/personal.js

import request from "../../utils/request.js"

let startY = 0;
let moveY = 0;
let moveDistance = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    transformY:"translateY(0)",
    transition:"",
    userInfo:{},
    recentPlayList:[]
  },
  handleTouchStart(event){
    this.setData({
      transition:""
    })
    startY = event.touches[0].clientY
  },
  handleTouchMove(event){

    moveY = event.touches[0].clientY;
    moveDistance = moveY-startY;
    if(moveDistance<0){
      return
    }
    if(moveDistance>=80){
      moveDistance = 80
    }
    this.setData({
      transformY:"translateY("+moveDistance+"rpx)"
    })
  },
  handleTouchEnd(event){
    this.setData({
      transformY:"translateY(0rpx)",
      transition:"transform 0.5s linear"
    })
  },
  login(){
    if(!this.data.userInfo.nickname){
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
  },
  async getRecentPlayList(userId){

    let RecordRes = await request("/user/record",{
      type:0,
      uid:userId
    })

    let recentPlayList = RecordRes.allData.slice(0,10);
    let index = 0;
    recentPlayList = recentPlayList.map((item)=>{
      item.id = index ++;
      return item 
    })
    this.setData({
      recentPlayList:recentPlayList
    })

    // var reqTask = wx.request({
    //   url: 'http://localhost:3000/user/record',
    //   data: {
    //     type:0,
    //     uid:userId
    //   },
    //   header: {'content-type':'application/json'},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (res)=>{
    //     let recentPlayList = res.data.allData.slice(0,10);
    //     let index = 0;
    //     recentPlayList = recentPlayList.map((item)=>{
    //       item.id = index ++;
    //       return item 
    //     })
    //     this.setData({
    //       recentPlayList:recentPlayList
    //     })
    //   }
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");

    if(userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      this.getRecentPlayList(JSON.parse(userInfo).userId)
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