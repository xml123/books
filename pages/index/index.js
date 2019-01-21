// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex: 1,
    bannerOne:{},
    bannerTwo:[],
    urlImg: getApp().globalData.urlImg,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBannerOne()
  },

  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },

  //获取banner推荐
  getBannerOne:function(){
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.url + '/api/get_banner_one',
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          const data = res.data.data
          that.setData({
            bannerOne:data.bannerOne,
            bannerTwo:data.bannerTwo
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
      },
      complete:function(){
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

  },
  //跳转到书籍简介
  toBook:function(e){
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../pages/bookAbstract/bookAbstract?id='+id,
    })
  },
  //跳转到免费书籍列表页
  toFreeBooks:function(){
    wx.navigateTo({
      url: '../../pages/freeBooks/freeBooks',
    })
  }
})