// pages/chapterDetail/chapterDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookid:'',
    chapterid:1,
    hideChapterList:true,
    chapterDetail:{},
    chapterList:[],//所有章节
    book_name:'',//小说名
    isSelect:'',//是否收藏过该小说
    toView:'',
    styleColor:'sum',
    wordSize:'',
    bgColor:'#fff',
    setShow:false,
    showSetting:false,
    getChapter:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const bookid = options.bookid
    let chapterid = options.chapterid
    let book_name = options.bookTitle
    let isSelect = options.isSelect
    that.getUserSetting()
    wx.setNavigationBarTitle({
      title: book_name
    })
    that.setData({
      bookid: bookid,
      chapterid: chapterid,
      book_name: book_name,
      isSelect: isSelect
    }, () => {
      that.getCountent()
      //that.getChapterList()
    })
  },

  //切换设置的显示
  settingChange:function(){
    this.setData({
      showSetting: !this.data.showSetting,
      setShow:false
    })
  },

  //获取用户设置
  getUserSetting:function(){
    const that = this
    wx.request({
      url: getApp().globalData.url + '/api/get_user_setting',
      data: {
        openid: wx.getStorageSync('openid')
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          const data = res.data.data
          let size = isNaN(data.word_size) ? 36 : data.word_size
          that.setData({
            styleColor: data.read_status,
            wordSize: size,
            bgColor: data.bg_color
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

  //显示设置
  showSet:function(){
    this.setData({
      setShow: !this.data.setShow
    })
  },

  //获取章节详情
  getCountent:function(){
    let that = this
    wx.request({
      url: getApp().globalData.url + '/api/get_chapter_detail',
      method: 'POST',
      data:{
        bookId:that.data.bookid,
        chapterId: that.data.chapterid
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          let resdata = res.data.data.content
          //文章主体处理
          let positions = []
          let first = 0
          var pos = resdata.indexOf("\n");
          while (pos > -1) {
            positions.push(resdata.substring(first, pos));
            first = pos
            pos = resdata.indexOf("\n", pos + 1);
          }
          that.setData({
            chapterDetail: res.data.data,
            contentList: positions
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

  //获取所有章节
  getChapterList: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let that = this
    wx.request({
      url: getApp().globalData.url + '/api/get_chapter',
      method: 'POST',
      data: {
        id: that.data.bookid,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            chapterList:res.data.data,
            getChapter:false
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
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  //下一章
  nextChapter:function(){
    let chapterid = this.data.chapterid
    if (chapterid == this.data.chapterList.length){
      wx.showToast({
        title: '已经是最后一章～',
        icon: 'none',
        duration: 2000
      })
      return 
    }
    this.setData({
      chapterid: parseInt(chapterid) + 1
    }, ()=>{
      this.getCountent()
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 100
      });
    })
  },

  //上一章
  prevChapter:function(){
    let chapterid = this.data.chapterid
    if (chapterid == 1){
      wx.showToast({
        title: '已经是第一章～',
        icon: 'none',
        duration: 2000
      })
      return 
    }
    this.setData({
      chapterid: parseInt(chapterid) - 1
    }, () => {
      this.getCountent()
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 100
      });
    })
  },

  //跳转到指定章节
  toChapter:function(e){
    let that = this
    let id = e.currentTarget.dataset.id
    that.setData({
      chapterid:id,
      hideChapterList: true
    }, () => this.getCountent())
  },

  //显示章节遮罩层
  showChapterList:function(){
    const that = this
    if (that.data.getChapter){
      that.getChapterList()
    }
    if (parseInt(this.data.chapterid) >= 10){
      that.setData({
        hideChapterList: false,
        showSetting:false,
        toView: 'inToView' + parseInt(this.data.chapterid - 5)
      })
    }else{
      that.setData({
        hideChapterList: false,
        showSetting:false
      })
    } 
  },

  //关闭遮罩层
  closeChapter:function(){
    this.setData({
      hideChapterList: true
    })
  },

  //退出时保存该小说
  saveChapter:function(){
    let that = this
    if (that.data.isSelect == 'false'){
      console.log('未收藏该小说')
      return 
    }else{
      const openid = wx.getStorageSync('openid')
      const bookid = that.data.bookid
      const capterid = that.data.chapterid
      wx.request({
        url: getApp().globalData.url + '/api/save_chapter',
        method: 'POST',
        data: {
          openid: openid,
          bookid: bookid,
          capterid: capterid
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.code == 200) {
            console.log('保存章节成功!')
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
    }
  },

  //夜读或日读
  changeColor:function(){
    let status = this.data.styleColor == 'sum' ? 'light' : 'sum'
    this.setData({
      styleColor:status,
      setShow: false
    }, () => this.changeSetting()) 
  },

  //设置背景色
  changeBgColor:function(e){
    let this_color = e.currentTarget.dataset.color
    this.setData({
      bgColor: this_color
    }, () => this.changeSetting())
  },

  //设置字体大小
  changeFontSize:function(e){
    const that = this
    let size_type = e.currentTarget.dataset.size
    let size = parseInt(that.data.wordSize)
    if (size_type == 'reduce' && size>20){
      size = size - 2
    } else if (size_type == 'add' && size < 44){
      size = size + 2
    }else{
      return
    }
    that.setData({
      wordSize:size
    }, () => this.changeSetting())
  },

  changeSetting:function(){
    const that = this
    let styleColor = that.data.styleColor
    let wordSize = that.data.wordSize
    let bgColor = that.data.bgColor
    console.log('wordSize', wordSize)
    wx.request({
      url: getApp().globalData.url + '/api/save_user_setting',
      data: {
        openid: wx.getStorageSync('openid'),
        read_status: styleColor,
        word_size: wordSize,
        bg_color: bgColor
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (e) {
        console.log('网络出错');
      }
    })
  },


  //加入书架
  addStore:function(){
    const that = this
    const collectStatus = that.data.isSelect
    if (collectStatus == 'true'){
      wx.showToast({
        title: '已在书架',
        icon: 'none',
        duration: 2000
      })
      return
    }else{
      wx.request({
        url: getApp().globalData.url + '/api/save_collect_book',
        data: {
          openid: wx.getStorageSync('openid'),
          bookid: that.data.bookid
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              isSelect: 'true'
            })
            wx.showToast({
              title: '收藏成功',
              duration: 2000
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
    // console.log('退出该小说')
    // this.saveChapter()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('退出该小说2')
    this.saveChapter()
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