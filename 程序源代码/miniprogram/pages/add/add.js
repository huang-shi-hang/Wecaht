// pages/add/add.js
const db = wx.cloud.database()
const photos = db.collection('photos')
const collect = db.collection('collect')

var app = getApp()

function formatDate(){
    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var day = now.getDate()

    if(month<10) month = '0' + month
    if(day<10) day = '0' + day

    return year+'-' + month + '-' + day
}

Page({
    /**
     * 页面初始化数据
     */
    data: {
        historyPhotos: [],
    },
    /**生命周期函数--监听页面加载 */
    onLoad: function(options){
         console.log(app.globalData.userInfo)
         console.log(app.globalData.openid)
        //更新历史记录
        this.getHistoryPhotos()
    },
    upload: function(){
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType:['album', 'camera'],
            success: function(res){
                //loading提示框提示正在上传
                wx.showLoading({
                  title: '上传中',
                })
                //获取图片临时地址
                const filePath = res.tempFilePaths[0]

                //自定义云端的图片名称
                const cloudPath = Math.floor(Math.random()*1000000) + Date.now() + filePath.match(/.[^.]+?$/)[0] 
                //上传图片到云存储空间
                wx.cloud.uploadFile({
                    cloudPath,
                    filePath,
                    success: res => {

                        //获取用户个人基础信息
                        let userInfo = app.globalData.userInfo

                        //获取当天日期
                        let today = formatDate()

                        //向云数据库中添加一条记录
                        photos.add({
                            data: {
                                photoUrl: res.fileID,
                                avatarUrl:userInfo.avatarUrl,
                                country: userInfo.country,
                                province:userInfo.province,
                                nickName:userInfo.nickName,
                                addDate: today,
                                upnum:0,
                                collectnum:0,
                                downloadnum:0,
                            },
                            success: res =>{
                                console.log(res)
                                this.getHistoryPhotos()
                            },
                            fail: e =>{
                                console.log(e)
                            },
                        })
                        //结束loading
                        wx.hideLoading()
                       //提示上传成功
                        wx.showToast({
                          title: '上传成功!',
                          duration: 3000
                        })
                        this.getHistoryPhotos()                  
                    },
                    fail: e => {
                        console.log(e)
                        wx.hideLoading()
                        //提示上传失败
                        wx.showToast({
                            icon:'none',
                            title: '上传失败',
                            duration:3000
                        })
                    }
                })
            },
            
            fail:e => {
                console.log(4444)
                console.error(e)
            },

            complete: () => {
                //上传完毕关闭loading提示
                //wx.hideLoading()
                //更新历史记录
                //this.getHistoryPhotos()
            }
        })
    },
    /**
     * 自定义函数--获取已经上传图片的历史
     */
    getHistoryPhotos:function(){
        //获取当前的用户id
        let openid = app.globalData.openid

        //从云数据集中查找当前用户的上传记录
        photos.where({
            _openid: openid
        }).get({
            success:res => {
                console.log(res)
                this.setData({historyPhotos:res.data})
            }
        })
    },
})