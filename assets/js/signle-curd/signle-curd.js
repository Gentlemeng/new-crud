$(function () {
    //默认“单表管理”展开
    $('.navs ul li:eq(1) ul').show();
    var pageNum=1,
        pageSize = 10,
        endPage,
        typeFlag;
    // var url="http://192.168.1.127:8905"
    //单位
    fuzzyGetHomePage({
        url: url + '/viewdim',
        pageNum: pageNum||1,
        pageSize: pageSize||10,
        typeFlag: "unit",
        whichSingle: '#single-manage1 '
    })
    //数据类型
    fuzzyGetHomePage({
        url: url + '/viewdim',
        pageNum: pageNum||1,
        pageSize: pageSize||10,
        typeFlag: "datatype",
        whichSingle: '#single-manage2 '
    })
    //行业
    fuzzyGetHomePage({
        url: url + '/viewdim',
        pageNum: pageNum||1,
        pageSize: pageSize||10,
        typeFlag: "industry",
        whichSingle: '#single-manage3 '
    })
    //指标
    fuzzyGetHomePage({
        url: url + '/viewdim',
        pageNum: pageNum||1,
        pageSize: pageSize||10,
        typeFlag: "index",
        whichSingle: '#single-manage4 '
    })
    //点击首页
    $('.homePage').click(function(){
        var that=$(this);
        updownPage(that);
    })
    //点击上一页
    $('.previous').click(function () {
        var that = $(this)
        updownPage(that);
    });
    //点击下一页
    $('.next').click(function () {
        var that = $(this)
        updownPage(that);
    });
    //点击尾页
    $('.end').click(function(){
        var that=$(this);
        updownPage(that);
    });
    //跳转
    $('.go').click(function(){
        var that=$(this);
        updownPage(that);
    })
})