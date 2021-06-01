// pages/search/search.js
import request from "../../utils/request.js"

let isSend = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:"",
    hotItemList:[],
    searchResultList:[],
    searchContent:"",
    historyList:[]
  },
  handleResTap(event){
    let index = event.currentTarget.dataset.index ; 
    console.log(index)
    wx.navigateTo({
      url: '/pages/musicPlayer/musicPlayer?musicId='+index+'&onlyone='+'0',
    });

  },
  async initialData(){
    let placeholder = await request("/search/default")
    let hotlist = await request("/search/hot/detail") 
    this.setData({
      placeholder:placeholder.data.realkeyword,
      hotItemList:hotlist.data
    })

    let historyList = wx.getStorageSync("historyList");
    if(historyList.length>0){
      this.setData({
        historyList:historyList
      })
    }

  },
  handleClearInput(){

    this.setData({
      searchContent:"",
      searchResultList:[]
    })
  },
  handleDelete(){
    wx.showModal({
      title: '是否确定删除历史记录',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          this.setData({
            historyList:[]
          })
          wx.removeStorageSync("historyList");
        }
      },
    });

  },
  handleInput(event){

    let queryParam = event.detail.value.trim();
    this.setData({
      searchContent:queryParam
    })
    // if(!queryParam){
    //   this.setData({
    //     searchResultList:[],
    //     searchContent:""
    //   })
    //   return
    // }
    if(isSend){
      return
    }else{
      isSend = true;
    }

    this.searchSong()
    setTimeout(()=>{
      isSend = false
    },1000)
  },

  async searchSong(){
    if(!this.data.searchContent){
      this.setData({
        searchResultList:[]
      })
      return
    }

    let queryParam = this.data.searchContent;
    let  result = await request("/search",{keywords:queryParam,limit:10})

    this.setData({
      searchResultList:result.result.songs
    })

    let {historyList} = this.data;

    if(historyList.indexOf(queryParam)!==-1){
      historyList.splice(historyList.indexOf(queryParam),1)
    }
    historyList.unshift(queryParam)
    this.setData({
      historyList:historyList
    })
    wx.setStorageSync("historyList", historyList);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.initialData();
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