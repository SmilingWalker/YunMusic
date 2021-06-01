// pages/video/video.js

import request from "../../utils/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    navId:"",
    videoContentList:[],
    vid:"",
    isRefreshing:false
  },
  // 获取 视频列表
  async getVideoGroupList(){
    let videoGroupRes = await request("/video/group/list")
    this.setData({
      videoGroupList:videoGroupRes.data.slice(0,14),
      navId:videoGroupRes.data[0].id
    })
    this.getVideoContentList(videoGroupRes.data[0].id)
  },
  toSearchPage(){
    wx.navigateTo({
      url: '/pages/search/search',
    });
  },
  changeVideoGroup(event){
    console.log(event.currentTarget.id)
  },

  async getVideoContentList(navId){
    let cookies = wx.getStorageSync("cookies");
    if(!cookies){
      wx.showModal({
        title: '当前用户未登录，请登录获取信息',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        complete:()=>{
          wx.navigateTo({
            url: '/pages/login/login'
          });
        }
      });
      return
    }
    let cookie = cookies.find((item)=>item.indexOf("MUSIC_U")!==-1);
    
    let videoContenRes = await request("/video/group",{id:navId})

    this.setData({
      //关闭下拉刷新
      isRefreshing:false,
      videoContentList:videoContenRes.datas
    })
    wx.hideLoading();


    // wx.request({
    //   url: 'http://localhost:3000/video/group',
    //   data: {
    //     id:navId
    //   },
    //   header: {
    //     'content-type':'application/json',
    //     'cookie':cookie
    //   },
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (result)=>{
    //     this.setData({
    //       //关闭下拉刷新
    //       isRefreshing:false,
    //       videoContentList:result.data.datas
    //     })
    //     wx.hideLoading();
    //   },
    // });
  },
  getNavId(event){
    /**默认使用 wx:key 会将Id转化为数字 */
    let navId = event.currentTarget.id;
    this.setData({
      navId:navId*1,
      videoContentList:[]
    })

    /**导航栏转换后，内容需要跟着切换 */
    // 显示正在加载信息
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });
    this.getVideoContentList(navId)
  },
  handlePlay(event){
    /**解决视频播放问题，因为当前视频播放存在 同时播放问题，因此需要控制播放 */
    let vid = event.currentTarget.id;
    if(this.data.vid!==""&&this.data.vid!==vid){
      this.videoContext = wx.createVideoContext(this.data.vid);
      this.videoContext.stop();
    }
    this.setData({
      vid:vid
    })
    this.videoContext = wx.createVideoContext(vid);
    this.videoContext.play();
  },
  handleRefresh(){
    this.getVideoContentList(this.data.navId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /**更新导航栏数据 */
    this.getVideoGroupList()
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
  onShareAppMessage: function ({from}) {
    return {
      title:"转发内容",
      path:"/pages/video/video"
    }

  }
})