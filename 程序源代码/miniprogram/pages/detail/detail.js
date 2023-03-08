// pages/detail/detail.js
const db = wx.cloud.database()
const photos = db.collection('photos')
const collect = db.collection('collect')
let id = ''
var app = getApp()


Page({
    /**
     * 页面的初始数据
     */
    data: {
        likestatus : false,
        collectstatus : false,
        newupnum: 0,
        newcollectnum: 0,
        newdownloadnum:0,
        newsharenum:0,
    },
    /**
     * 自定义函数 下载图片到本地
     */
    downloadPhoto: function(){
        this.setData({newdownloadnum: this.data.newdownloadnum+1})
        photos.doc(id).update({
            data:{
                downloadnum: this.data.newdownloadnum
            }, 
        })

        //从云存储中进行图片下载
        wx.cloud.downloadFile({
            fileID: this.data.photo.photoUrl,
            success: res => {
                //保存图片到本地相册
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: res => {
                      wx.showToast({
                          title:'保存成功！',
                      })
                  },
                  fail: err => {
                      wx.showToast({
                        title: '保存失败！',
                        icon:'none'
                      })
                  }
                })
            },
            fail: err => {
                console.log(err)
            }
        })
    },

    /**
     * 分享给好友
     */
    onShareAppMessage: function(){
        return{
            title:'给你分享一张好看的图片',
            path:'pages/detail/detail?id=' + this.data.photo._id
        }
    },
    /**
     * 自定义函数：全屏预览函数
     */
    previewPhoto:function(){
        //定义图片URL地址
        var url = [this.data.photo.photoUrl]
        //全屏预览图片
        wx.previewImage({
          urls: url,
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        id = options.id
        //根据图片id获取云数据库中的图片记录
        photos.doc(options.id).get({
            success: res=>{
                this.setData({
                    photo: res.data,
                    newupnum: res.data.upnum,
                    newcollectnum: res.data.collectnum,
                    newdownloadnum: res.data.downloadnum,
                })
            }
        })
    },
    
    //实现点赞功能
    like:function(){
        this.setData({newupnum: this.data.newupnum+1})
        photos.doc(id).update({
            data:{
                upnum:this.data.newupnum
            }, 
        })
        this.setData({likestatus :true})
    },
    //实现收藏功能
    collect:function(){
        this.setData({newcollectnum: this.data.newcollectnum+1})
        photos.doc(id).update({
            data:{
                collectnum:this.data.newcollectnum
            },
        })
        this.setData({collectstatus: true})
        let openid = app.globalData.openid

        //收藏的图片放入集合中
        collect.add({
            data: {
                pictureid:this.data.photo._id
            },
            success: res =>{
                console.log(res)
            },
            fail: e =>{
                console.log(e)
            },
        })
    },
})