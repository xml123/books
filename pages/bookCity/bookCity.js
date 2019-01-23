// pages/bookCity/bookCity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeArrey:[], //猜你喜欢
    hotArray:[],  //热门推荐
    urlImg: getApp().globalData.urlImg,
  },

  //猜你喜欢
  getYouLike:function(){
    let that = this
    wx.request({
      url: getApp().globalData.url + '/api/get_you_like',
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if(res.data.code == 200){
          that.setData({
            likeArrey:res.data.data
          })
        }else{
          wx.showToast({
            title: '请求失败，请稍后重试',
            duration: 2000
          })
        }
      },
      fail: function (e) {
        console.log('网络出错');
      }
    })
  },
  //换一批猜你喜欢
  chageYouLike:function(){
    this.getYouLike()
  },

  //热门推荐
  hotRecommond:function(){
    let that = this
    wx.request({
      url: getApp().globalData.url + '/api/get_hot_recommend',
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.data)
          that.setData({
            hotArray: res.data.data
          })
        } else {
          wx.showToast({
            title: '请求失败，请稍后重试',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getYouLike()
    this.hotRecommond()
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
  //跳转到小说简介
  toBookAbstract:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../pages/bookAbstract/bookAbstract?id='+id,
    })
  },
  //查看更多免费书籍
  toMoreBooks:function(){
    wx.navigateTo({
      url: '../../pages/freeBooks/freeBooks',
    })
  }
})