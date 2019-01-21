// pages/bookStore/bookStore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList:[],
    urlImg: getApp().globalData.urlImg
  },

  getCollect:function(){
    let that = this
    wx.request({
      url: getApp().globalData.url + '/api/get_collect',
      data: {
        openid: wx.getStorageSync('openid'),
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            collectList:res.data.data
          })
        } else {
          wx.showToast({
            title: '请求失败，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (e) {
        console.log('网络出错');
      }
    })
  },

  //取消收藏
  deleatBook: function (e) {
    const that = this
    const bookid = e.currentTarget.dataset.bookid
    const openid = wx.getStorageSync('openid')
    wx.showModal({
      title: '是否下架该书',
      content: '下架后该书的阅读记录将被清除',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + '/api/remove_collect_book',
            data: {
              bookid: bookid,
              openid: openid,
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '下架成功',
                  icon: 'success',
                  mask: true,
                  duration: 1200
                })
                that.getCollect()
              } else {
                wx.showToast({
                  title: '操作失败',
                  icon: 'none',
                  mask: true,
                  duration: 2000
                })
              }
            },
            fail: function () {
              wx.showToast({
                title: '请求超时',
                icon: 'none',
                mask: true,
                duration: 2000
              })
            },
            complete: function () {
            }
          })
        } else if (res.cancel) {
          console.log('取消删除收藏')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollect()
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
    //this.getCollect()
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

  },

  //跳转到书城
  toBookCity:function(){
    wx.switchTab({
      url: '../../pages/bookCity/bookCity',
    })
  },

  //开始阅读
  toBookDetail:function(e){
    const title = e.currentTarget.dataset.title
    const bookid = e.currentTarget.dataset.bookid
    const chapterid = e.currentTarget.dataset.chapterid
    wx.navigateTo({
      url: '../../pages/chapterDetail/chapterDetail?bookid=' + bookid + '&chapterid=' + chapterid + '&bookTitle=' + title +'&isSelect=true',
    })
  }
})