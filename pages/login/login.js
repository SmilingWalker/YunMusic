import request from "../../utils/request";

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellphone:"",
    password:"",
  },
  handleInput(event){
    let type = event.currentTarget.id;
    this.setData({
      [type]:event.detail.value
    })
  },
  async login(){
    let {cellphone,password} = this.data
    
    if(!cellphone || !password){
      wx.showToast({
        title: '手机号或密码错误，请重新输入',
        icon: 'none',
      })
      return
    }
    let reg = /^1(3|4|5|6|7|8|9)\d{9}$/;/^1(3|5)\d{9}$/
    if(!reg.test(cellphone)){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
      })
      return
    }

    let loginRes = await request("/login/cellphone",{
        phone:cellphone,
        password:password,
        isLogin:true
    })

    if(loginRes.code!==200){
      wx.showToast({
        title: '手机号或密码错误',
        icon: 'none',
      });
    }else{
      // wx.showToast({
      //   title: '登录成功',
      //   icon: 'success',
      // }); 
      wx.setStorageSync("userInfo",JSON.stringify(loginRes.profile));
      wx.reLaunch({
        url: '/pages/personal/personal'
      });
    }
    // wx.request({
    //   url: 'http://localhost:3000/login/cellphone',
    //   data: {
    //     phone:cellphone,
    //     password:password
    //   },
    //   header: {'content-type':'application/json'},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (res)=>{
    //     if(res.data.code!==200){
    //       wx.showToast({
    //         title: '手机号或密码错误',
    //         icon: 'none',
    //       });
    //     }else{
    //       // wx.showToast({
    //       //   title: '登录成功',
    //       //   icon: 'success',
    //       // }); 
    //       console.log(res)
    //       wx.setStorageSync("userInfo",JSON.stringify(res.data.profile));
    //       wx.setStorageSync("cookies",res.cookies)
    //       wx.reLaunch({
    //         url: '/pages/personal/personal'
    //       });
    //     }
    //   }
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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