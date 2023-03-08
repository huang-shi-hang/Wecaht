// pages/home/home.js
var app = getApp()
Page({

   /**
   * 自定义函数--获取用户个人信息
   */
  getUserInfo: function(e){
    //尝试打印输出个人信息，测试是否获取成功
    console.log(e.detail.userInfo)
    //将个人信息放到全局变量userInfo中
    app.globalData.userInfo = e.detail.userInfo

    //检测是否已经获得了用户的openid信息
    if(app.globalData.openid == null){
      //如果是第一次登录则使用云函数获取用户信息
      wx.cloud.callFunction({
        name: 'getOpenid',
        complete: res =>{
          //尝试打印个人信息，看是否获取成功
          console.log(res.result.openid)
          //将用户openid信息存放到全局变量openid信息存储到全局变量openid中
          app.globalData.openid = res.result.openid
        }
      })
    }
  },

    get:function(){
        wx.getSystemInfo({
            success (res) {
              console.log(res.model)
              console.log(res.pixelRatio)
              console.log(res.windowWidth)
              console.log(res.windowHeight)
              console.log(res.language)
              console.log(res.version)
              console.log(res.platform)
            }
          })
    },
    goToAdd: function(options){
        wx.navigateTo({
          url:'../add/add',
        })
      },
      goTocollect: function(options){
        wx.navigateTo({
          url:'../collect/collect',
        })
      },
      goTohomepage: function(options){
        console.log(app.globalData.openid)
        wx.navigateTo({
          url:'../homepage/homepage?id='+app.globalData.openid,
        })
      },
      goToindex: function(options){
        wx.navigateTo({
          url:'../index/index',
        })
      },

    /**
     * 页面的初始数据
     */
    data: {

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