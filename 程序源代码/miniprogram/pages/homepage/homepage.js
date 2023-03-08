// pages/homepage/homepage.js
const db = wx.cloud.database()
const photos = db.collection('photos')

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

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取被点击用户的openid
        let openid = options.id

        //显示loading提示框
        wx.showLoading({
          title: '数据加载中',
        })

        //查找云数据集photos该用户的图片上传记录
        photos.orderBy('addDate', 'desc').where({
            _openid:openid 
        }).get({
            success: res => {
                this.setData({
                    photoList: res.data
                })
                //关闭loading提示框
                wx.hideLoading()
            }
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