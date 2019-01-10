// pages/bookAbstract/bookAbstract.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    abstractAll:{},
    isSelect:false,
    this_chapter_num:'1',
    urlImg: getApp().globalData.urlImg,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.setData({
      id:id
    }, ()=>this.getAbatractDetail())
  },

  getAbatractDetail:function(){
    let that = this
    wx.request({
      url: getApp().globalData.url + '/api/get_abstract',
      data:{
        bookId:that.data.id,
        openId: wx.getStorageSync('openid'),
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            abstractAll:res.data.data,
            isSelect: res.data.data.collect == 1,
            this_chapter_num: res.data.data.chapterid
          })
        } else {
          wx.showToast({
            title: '请求失败，请稍后重试',
            icon:'none',
            duration: 2000
          })
        }
      },
      fail: function (e) {
        console.log('网络出错');
      }
    })
  },

  //开始阅读
  beginRead:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../pages/chapterDetail/chapterDetail?bookid=' + id + '&chapterid=' + this.data.this_chapter_num +'&bookTitle=' + this.data.abstractAll.title + '&isSelect=' + this.data.isSelect,
    })
  },

  //加入书架
  addStore:function(){
    let that = this
    wx.request({
      url: getApp().globalData.url + '/api/save_collect_book',
      data: {
        openid: wx.getStorageSync('openid'),
        bookid:that.data.id
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            isSelect:true
          })
          wx.showToast({
            title: '收藏成功',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '请求失败，请稍后重试',
            icon:'none',
            duration: 2000
          })
        }
      },
      fail: function (e) {
        console.log('网络出错');
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
    this.getAbatractDetail()
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