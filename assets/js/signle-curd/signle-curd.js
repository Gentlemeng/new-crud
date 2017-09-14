$(function () {
    //默认“单表管理”展开  点击收缩展开
    $('#singleList').next().show();
    $('#singleList').click(function () {
        $(this).next().toggle();
    });

    var pageNum = 1,
        pageSize = 10,
        endPage,
        typeFlag;
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
    })
    //点击添加保存按钮
    $('#saveAddSingle').click(function () {
        if (!$.trim($('#singleAddForm input[name="dimName"]').val())) {
            console.log($('#singleAddForm input[name="dimName"]').val())
            console.log('名称不能为空');
            return;
        } else {
            var singleData = $('#singleAddForm').serialize();
            var addSingleData = {
                url: url + '/adddim',
                data: singleData,
                //添加保存成功
                success: function (result) {
                    // var pageNum = result.allPage;
                    // // console.log(pageNum)
                    // var typeFlag = $('#singleAddForm input[name="typeFlag"]').attr('value');
                    // console.log(typeFlag)
                    // var whichSingle = '';
                    // if (typeFlag == 'unit') {
                    //     whichSingle = '#single-manage1 '
                    // } else if (typeFlag == 'datatype') {
                    //     whichSingle = '#single-manage2 '
                    // }
                    // fuzzyGetHomePage({
                    //     url: url + '/viewdim',
                    //     pageNum: pageNum,
                    //     pageSize: pageSize || 10,
                    //     typeFlag: typeFlag,
                    //     whichSingle: whichSingle
                    // })
                },
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

    //点击编辑按钮
    $('tbody').on('click', '.showModal', function () {
        var that = $(this);
        $('#singleEditModal').modal();

        addAndEditOfSingle(that);
        //请求数据，将id和typeFlag传递过去
        var id = $(this).attr('editId'),
            typeFlag = $('#singleAddForm input[name="typeFlag"]').val();
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
            if (!$.trim($('#singleEditForm input[name="dimName"]').val())) {
                alert('名称不能为空');
                return;
            } else {
                var singleData = $('#singleEditForm').serialize();
                // console.log(singleData);
                var addSingleData = {
                    url: url + '/updatedim',
                    data: singleData,
                    success: function (result) {
                        // console.log(result);
                    },
                    error: function (err) {
                        console.log(err)
                    }
                }
                $.ajax(addSingleData)

                //隐藏模态框
                $('#singleEditModal').modal('hide')
                // 清空输入框
                // $('#singleAddForm input').val('');
                //当前页刷新
                updownPage(that, url + '/viewdim')
                // var pageNum = that.closest('table').next().find('.record').attr('currentPage');
                // console.log(pageNum)

            }
        })
    })


    //点击删除按钮
    $('tbody').on('click', '.delete', function () {
        var deleteId = $(this).prev().attr('editId');
        var typeFlag = $(this).attr('typeFlag');
        var that = $(this);

        console.log(typeFlag)
        $.ajax({
            url: url + '/deletedim',
            data: {
                id: deleteId,
                typeFlag: typeFlag
            },
            success: function (result) {
                console.log('删除成功');
                // var pageNum=
                // fuzzyGetHomePage({
                //     url:url+'/viewdim',
                //     pageNum:pageNum
                // })
                //当前页刷新
                updownPage(that, url + '/viewdim')
            },
            error: function (err) {
                console.log(err);
            }
        })
    })

    //封装
    //弹出模态框:单位与其他三个单表项目显示不同
    function addAndEditOfSingle(that) {
        var id = that.closest('.panel').attr('id');
        // console.log(id)
        var editId = that.attr('editId')
        var flag = true;
        var selectors = {
            add: '#singleAddForm',
            edit: '#singleEditForm'
        };
        if (id == "single-manage1") {
            if (!editId) {
                $('#singleEditForm input[name="id"]').val(0);
            } else {
                $('#singleEditForm input[name="id"]').val(editId);
            }
            $('#singleAddForm input[name="typeFlag"]').val('unit');
            $('#singleEditForm input[name="typeFlag"]').val('unit');
            //隐藏 dimShortName
            if (flag) {
                $('#singleAddForm p').eq(2).hide();
                $('#singleAddForm input[name="dimShortName"]').hide();
                $('#singleEditForm p').eq(2).hide();
                $('#singleEditForm input[name="dimShortName"]').hide();
                flag = false;
            }
        } else if (id == "single-manage2") {
            hideAndshow(selectors, 'datatype', editId)
        } else if (id == "single-manage3") {
            hideAndshow(selectors, 'industry', editId)
        } else if (id == "single-manage4") {
            hideAndshow(selectors, 'index', editId)
        }

        //模态框：不同单表显示不同样式和typeFlag的不同
        function hideAndshow(eles, typeFlag, editId) {
            // console.log(typeFlag)
            if (!id) {
                $(eles.edit + ' input[name="id"]').val(0);
            } else {
                $(eles.edit + ' input[name="id"]').val(editId);
            }
            $(eles.add + ' input[name="typeFlag"]').val(typeFlag);
            $(eles.edit + ' input[name="typeFlag"]').val(typeFlag);
            $(eles.add + ' p').eq(2).show();
            $(eles.edit + ' p').eq(2).show();
            $(eles.add + ' input[name="dimShortName"]').show();
            $(eles.edit + ' input[name="dimShortName"]').show();
        }
    }
    //添加保存和编辑保存



})