$(function () {
    //默认“单表管理”展开
    $('.navs ul li:eq(1) ul').show();
    var pageNum = 1,
        pageSize = 10,
        endPage,
        typeFlag;
    // var url="http://192.168.1.127:8905"
    //单位
    fuzzyGetHomePage({
        url: url + '/viewdim',
        pageNum: pageNum || 1,
        pageSize: pageSize || 10,
        typeFlag: "unit",
        whichSingle: '#single-manage1 '
    })
    //数据类型
    fuzzyGetHomePage({
        url: url + '/viewdim',
        pageNum: pageNum || 1,
        pageSize: pageSize || 10,
        typeFlag: "datatype",
        whichSingle: '#single-manage2 '
    })
    //行业
    fuzzyGetHomePage({
        url: url + '/viewdim',
        pageNum: pageNum || 1,
        pageSize: pageSize || 10,
        typeFlag: "industry",
        whichSingle: '#single-manage3 '
    })
    //指标
    fuzzyGetHomePage({
        url: url + '/viewdim',
        pageNum: pageNum || 1,
        pageSize: pageSize || 10,
        typeFlag: "index",
        whichSingle: '#single-manage4 '
    })
    //点击首页
    $('.homePage').click(function () {
        var that = $(this);
        updownPage(that, url + "/viewdim");
    })
    //点击上一页
    $('.previous').click(function () {
        var that = $(this)
        updownPage(that, url + "/viewdim");
    });
    //点击下一页
    $('.next').click(function () {
        var that = $(this)
        updownPage(that, url + "/viewdim");
    });
    //点击尾页
    $('.end').click(function () {
        var that = $(this);
        updownPage(that, url + "/viewdim");
    });
    //跳转
    $('.go').click(function () {
        var that = $(this);
        updownPage(that, url + "/viewdim");
    })

    //点击添加按钮
    // $('.body').on('click', '.addSingle', function () {
    $('.addSingle').click(function () {
        var that = $(this);
        addAndEditOfSingle(that);
        //点击添加保存按钮
        $('#saveAddSingle').click(function () {
            // console.log($('#singleAddForm input[name="dimName"]').val())
            if (!$.trim($('#singleAddForm input[name="dimName"]').val())) {
                alert('名称不能为空');
                return;
            } else {
                var singleData = $('#singleAddForm').serialize();
                var addSingleData = {
                    url: url + '/adddim',
                    data: singleData,
                    //添加保存成功
                    success: function (result) {},
                    error: function (err) {
                        console.log(err)
                    }
                }
                $.ajax(addSingleData)
                //隐藏模态框
                $('#singleAddModal').modal('hide')
                //清空输入框
                $('#singleAddForm input').val('')   
            }
        })
    })

    // })

    //点击编辑按钮
    $('tbody').on('click', '.showModal', function () {
        $('#singleEditModal').modal();
        var that = $(this);

        addAndEditOfSingle(that);
        var id = $(this).attr('editId'),
            typeFlag = $('#singleAddForm input[name="typeFlag"]').val();
        //请求数据，将id和typeFlag传递过去
        $.ajax({
            url: url + '/updateview',
            data: {
                id: id,
                typeFlag: typeFlag
            },
            success: function (result) {
                console.log(result);
                $('#singleEditForm input[name="dimName"]').val(result.dimName);
                $('#singleEditForm input[name="dimCode"]').val(result.dimCode);
                $('#singleEditForm input[name="dimShortName"]').val(result.dimShortName);
                $('#singleEditForm input[name="dimRemark"]').val(result.dimRemark);
            },
            error: function (err) {
                console.log(err);
            }
        });
        //点击编辑保存按钮
        $('#saveEditSingle').click(function () {
            var singleData = $('#singleEditForm').serialize();
            console.log(singleData);
            var addSingleData = {
                url: url + '/updatedim',
                data: singleData,
                success: function (result) {
                    console.log(result);
                },
                error: function (err) {
                    console.log(err)
                }
            }
            $.ajax(addSingleData)
            //隐藏模态框
            $('#singleEditModal').modal('hide')
            // 清空输入框
            $('#singleAddForm input').val('');
        })
    })
    //点击删除按钮
    $('tbody').on('click','.delete',function(){
        var deleteId=$(this).prev().attr('editId');
        var typeFlag=$(this).attr('typeFlag');
        console.log(typeFlag)
        $.ajax({
            url:url+'/deletedim',
            data:{id:deleteId,typeFlag:typeFlag},
            success:function(result){
                console.log(result);
            }
        })
    })

    //封装
    //弹出模态框
    function addAndEditOfSingle(that) {
        var id = that.closest('.panel').attr('id');
        var editId = that.attr('editId')
        var flag = true;
        if (id == "single-manage1") {
            if (!editId) {
                $('#singleEditForm input[name="id"]').val(0);
            } else {
                $('#singleEditForm input[name="id"]').val(editId);
            }
            $('#singleAddForm input[name="typeFlag"]').val('unit');
            $('#singleEditForm input[name="typeFlag"]').val('unit');            
            if (flag) {
                $('#singleAddForm p').eq(2).hide();
                $('#singleAddForm input[name="dimShortName"]').hide();
                $('#singleEditForm p').eq(2).hide();
                $('#singleEditForm input[name="dimShortName"]').hide();
                flag = false;
            }
        } else if (id = "single-manage2") {
            if (!editId) {
                $('#singleEditForm input[name="id"]').val(0);
            } else {
                $('#singleEditForm input[name="id"]').val(editId);
            }
            $('#singleAddForm input[name="typeFlag"]').val('datatype');
            $('#singleEditForm input[name="typeFlag"]').val('datatype');
            $('#singleAddForm p').eq(2).show();
            $('#singleEditForm p').eq(2).show();
            $('#singleAddForm input[name="dimShortName"]').show();
            $('#singleEditForm input[name="dimShortName"]').show();            
        } else if (id = "single-manage3") {
            if (!editId) {
                $('#singleAddForm input[name="id"]').val(0);
            } else {
                $('#singleAddForm input[name="id"]').val(editId);
            }
            $('#singleAddForm input[name="typeFlag"]').val('industry');
            $('#singleAddForm p').eq(2).show();
            $('#singleAddForm input[name="dimShortName"]').show();
        } else if (id = "single-manage4") {
            if (!editId) {
                $('#singleAddForm input[name="id"]').val(0);
            } else {
                $('#singleAddForm input[name="id"]').val(editId);
            }
            $('#singleAddForm input[name="typeFlag"]').val('index');
            $('#singleAddForm p').eq(2).show();
            $('#singleAddForm input[name="dimShortName"]').show();
        }

        // //如果是添加按钮
        // if (that.hasClass('addSingle')) {
        //     //给保存按钮加这类
        //     $('#save').addClass('addSingleBtn')
        // } else {
        //     //给保存按钮加这类
        //     $('#save').addClass('editSingleBtn')
        // }
    }
    //添加保存和编辑保存
    
    

})