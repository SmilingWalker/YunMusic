// pages/others/others.js

import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  search(value){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: 'http://localhost:3000/search',
        data: {keywords:value},
        header: {'content-type':'application/json'},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (result)=>{
          let songs = result.data.result.songs
          let res = []
          for(let song of songs.slice(0,6)){
            res.push({
              text:song.name,
              value:song.onHide
            })
          }
         resolve(res) 
        }
      });
    })
  },
  selectResult(e){
    console.log(e.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search: this.search.bind(this)
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