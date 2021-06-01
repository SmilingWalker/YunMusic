// pages/musicPlayer/musicPlayer.js
import PubSub, { publish } from 'pubsub-js'
import moment from "moment"


import request from "../../utils/request.js"

let appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicId:"",
    isPlaying:false,
    song:{},
    songUrl:"",
    BackgroundAudioManager:"",
    duration:"00:00",
    currentTime:"00:00",
    barWidth:0,
    onlyone:false

  },
  /**只负责修改状态，不负责其他内容 */
  handleMusicPlay(){

    let isPlaying = !this.data.isPlaying
    
    // this.getMusicUrl(this.data.musicId);
    // /**控制音乐的播放和暂停 */
    // this.backAudioManager = wx.getBackgroundAudioManager();
    // this.backAudioManager.title = this.data.song.name
    // this.backAudioManager.src = this.data.songUrl

    this.musicControll(isPlaying,this.data.musicId)

    appInstance.globalData.isMusicPlay = isPlaying

  },
  handleSwitch(event){

    if(this.data.onlyone){
      this.backAudioManager.seek(0);
      return
    }

    let type = event.currentTarget.id;

    /**停止当前的音乐播放 */
    this.backAudioManager.stop()
    PubSub.publish("SwitchMusic",type);

    PubSub.subscribe("MusicId",(msg,musicId)=>{
      
      this.setData({
        musicId:musicId
      })
      /**修改详情信息 */
      this.getMusicDetail(musicId)

      /**自动播放音乐 */
      this.setData({
        songUrl:""
      })
      this.musicControll(true,musicId)

      PubSub.unsubscribe("MusicId")
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      musicId:options.musicId
    })

    if(options.onlyone){
      this.setData({
        onlyone:true
      })
    }
    
    //更新界面上的详细信息
    this.getMusicDetail(options.musicId)

    /**判断是否用户正在播放 */

    if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId==options.musicId){
      this.setData({
        isPlaying:true
      })
    }
    /** 监听音乐的播放 */
    this.backAudioManager = wx.getBackgroundAudioManager();
    this.backAudioManager.onPause(()=>{
      this.setData({
        isPlaying:false
      })
    });
    this.backAudioManager.onPlay(()=>{
      this.setData({
        isPlaying:true
      })
      /**保存用户当前播放信息到app内 */
      appInstance.globalData.musicId = this.data.musicId
    });
    this.backAudioManager.onStop(()=>{
      this.setData({
        isPlaying:false
      })
    });

    this.backAudioManager.onTimeUpdate(()=>{
      let ct = this.backAudioManager.currentTime;
      ct = moment(ct * 1000).format("mm:ss")
      if(this.backAudioManager.duration===0){
        return
      }
      let barWidth =parseInt(this.backAudioManager.currentTime / this.backAudioManager.duration * 400);

      this.setData({
        currentTime:ct,
        barWidth:barWidth
      })
      /**修改 bar 长度 */
    })
    this.backAudioManager.onEnded(()=>{
      this.setData({
        currentTime:"00:00",
        barWidth:0
      })
      handleSwitch({
        currentTarget:{
          id:"next"
        }
      })
    })
  },

  async getMusicDetail(musicId){

    let musicDetailRes = await request("/song/detail",{ids:musicId})

    let duration = musicDetailRes.songs[0].dt;
    duration = moment(duration).format("mm:ss")
    this.setData({
      song:musicDetailRes.songs[0],
      duration:duration
    })
    wx.setNavigationBarTitle({
      title:musicDetailRes.songs[0].name ,
    });


    // wx.request({
    //   url: 'http://localhost:3000/song/detail',
    //   data: {
    //     ids:musicId
    //   },
    //   header: {'content-type':'application/json'},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (result)=>{
    //     let duration = result.data.songs[0].dt;
    //     duration = moment(duration).format("mm:ss")
    //     this.setData({
    //       song:result.data.songs[0],
    //       duration:duration
    //     })
    //     wx.setNavigationBarTitle({
    //       title:result.data.songs[0].name ,
    //     });

    //   }
    // });
  },
  async musicControll(isPlaying,musicId){
    if(isPlaying){
      if(!this.data.songUrl){

        /** async 和 await 只能保证其对应的函数是同步执行，而不能保证外层还是也是同步执行的，也就是说，只能保证async内的是同步执行的 */
        let data = await request("/song/url",{id:musicId});
        if(!data.data[0].url){
          wx.showModal({
            title: '当前音乐暂无播放源',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            complete: ()=>{
              wx.navigateBack({
                delta: 1
              });
            }
          });
        }else{
          this.setData({
            songUrl:data.data[0].url,
          }) 
        }
      }
      /**控制音乐的播放和暂停 */
      this.backAudioManager = wx.getBackgroundAudioManager();
      this.backAudioManager.title = this.data.song.name
      this.backAudioManager.src = this.data.songUrl
      this.backAudioManager.play()   
    }else{
      this.backAudioManager.pause()
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