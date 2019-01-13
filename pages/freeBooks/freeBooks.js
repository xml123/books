// pages/freeBooks/freeBooks.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlImg: getApp().globalData.urlImg,
    freeBookList:[],    //免费书籍列表
    page:2,   //页码
    noData:false,   //是否有数据，默认有数据
    isHideLoadMore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_free_books()
  },

  //获取免费书籍
  get_free_books:function(){
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.url + '/api/get_all_books',
      method: 'POST',
      data:{
        pageNum:1,
        pageSize:10,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          const data = res.data.data
          that.setData({
            freeBookList:data
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
    this.get_list_more()
  },

  //上拉加载跟更多
  get_list_more: function () {
    const that = this
    let page = that.data.page
    if (that.data.noData) {
      return //若已没有数据停止发送请求
    }
    that.setData({
      isHideLoadMore: false
    })
    wx.request({
      url: getApp().globalData.url + '/api/get_all_books',
      method: 'POST',
      data: {
        pageNum: page,
        pageSize: 10,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          let dataList = res.data.data
          if (dataList.length == 0) {
            that.setData({
              noData: true
            })
          } else {
            let freeBookList = that.data.freeBookList
            page: ++that.data.page,
            that.setData({
              freeBookList: freeBookList.concat(dataList)
            })
          }
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
      complete: function () {
        that.setData({
          isHideLoadMore: true
        })
      }
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //跳转到书籍简介
  toAbstract:function(e){
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../pages/bookAbstract/bookAbstract?id='+id,
    })
  }
})