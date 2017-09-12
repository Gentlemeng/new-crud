$(function () {
    //点击跳转到单表页面，阻止默认行为
    
    //点击任意地方，隐藏模态框
    $('body').click(function () {
        $('.searchTips').hide();
    })
    //初始化页数，每页条数，尾页
    var pageNum = 1,
        pageSize = 10,
        endPage,
        //搜索框内容
        searchCon;
    //获取首页数据
    fuzzyGetHomePage({
        url:url+'/findItem',
        pageNum: pageNum,
        pageSize: pageSize,
        searchId: searchId,
        whichSingle:'#total-manage '
    });
    // console.log(endPage);
    //点击首页
    $('.homePage').click(function () {
        searchCon=$('.itemName').val();
        // console.log(searchCon);
        pageNum = 1;
        //模糊查询
        fuzzyGetHomePage({
            url:url+'/findItem',
            pageNum: pageNum,
            pageSize: pageSize,
            searchId: searchId,
            searchName:searchCon,
            whichSingle:'#total-manage '
        })
    })
    //点击上一页
    $('.previous').click(function () {
        searchCon=$('.itemName').val();
        if (pageNum == 1) {
            alert('当前页为首页')
            return false;
        } else {
            pageNum--;
        }
        fuzzyGetHomePage({
            url:url+'/findItem',
            pageNum: pageNum,
            pageSize: pageSize,
            searchId: searchId,
            searchName:searchCon,
            whichSingle:'#total-manage '
        })
    });

    //点击下一页
    $('.next').click(function () {
        console.log(endPage);
        console.log(pageNum)
        searchCon=$('.itemName').val();
        if (pageNum >= endPage) {
            alert('当前页为最后一页')
            return;
        } else {
            pageNum++;
        }
        fuzzyGetHomePage({
            url:url+'/findItem',
            pageNum: pageNum,
            pageSize: pageSize,
            searchId: searchId,
            searchName:searchCon,
            whichSingle:'#total-manage '
        })
        // var that = $(this)
        // updownPage(that);
    });

    //点击尾页
    $('.end').click(function () {
        // console.log(endpage)
        pageNum = endPage
        searchCon=$('.itemName').val();
        fuzzyGetHomePage({
            url:url+'/findItem',
            pageNum: pageNum,
            pageSize: pageSize,
            searchId: searchId,
            searchName:searchCon,
            whichSingle:'#total-manage '
        })
    })
    //点击跳转页
    $('.go').click(function () {
        var val = $('.gotoPage').val();
        console.log(val - 0)
        // console.log(endPage)
        // console.log((parseInt($.trim(val)) - 0 < 1 ) || (parseInt($.trim(val)) - 0 > endPage))
        if ($.trim(val) == '' || ((parseInt($.trim(val)) - 0 < 1) || (parseInt($.trim(val)) - 0 > endPage))) {
            alert('请输入正确页码')
            return;
        } else {
            skipByPageNum();
        }
        $('.gotoPage').val('')
    })
    //点击添加按钮
    $('.addBtn').on('click', function () {
        //请求数据类型、行业、指标名称、区域相关数据；
        var addSelector = {
            operate:'add',
            unitName: '#unit',
            datatype: '#datatype',
            indusName: '#indusName',
            indexName: '#indexName',
            province: '#province',
            city: '#city',
            county: '#county'
        }
        getItemData(addSelector)
    })
    //点击保存按钮 
    $('#save').click(function () {
        // var itemName=$('input[name="itemName"]').val();
        // if(!$.trim(itemName)){
        //     alert('项目名称不能为空')
        //     return 
        // }
        //获取用户填写的数据
        $(".unit").val($('#unit option:selected').attr('unitId'));
        $("#frequency").val($(".frequency option:selected").val());
        $(".datatype").val($("#datatype option:selected").attr('typeId'));
        $(".industry").val($("#indusName option:selected").attr('indusId'));
        $(".indexName").val($("#indexName option:selected").attr('indexId'));
        var countyId = $("#county option:selected").attr('countyId')
        var cityId = $("#city option:selected").attr('cityId')
        var proId = $("#province option:selected").attr('proId')
        if (countyId) {
            $(".area").val(countyId)
        } else if (cityId) {    
            $(".area").val(cityId)
        } else if (proId) {
            $(".area").val(proId)
        } else {
            alert('请填入项目所属区域')
            return
        }
        var formData = $('#formAdd').serialize();
        console.log(formData); //%E8%AF%B7%E9%80%89%E6%8B%A9 
                                // %E8%AF%B7%E9%80%89%E6%8B%A9
        //保存数据发起ajax请求
        var saveData = {
            url: url+'/addItemSave',
            type: 'post',
            data: formData,
            success: function (result) {
                console.log("保存成功");
            }
        }
        $.ajax(saveData);
        //隐藏模态框
        $('#add').modal('hide')
        //清空输入框
        $('#formAdd input').val('');
        //初始化区域选择框
        $('#formAdd .outer select').html('<option>请选择</option>')
        //保存后进行页面渲染
        fuzzyGetHomePage({
            url:url+'/findItem',
            pageNum: 991,
            pageSize: pageSize,
            searchId: searchId,
            whichSingle:'#total-manage '
        });
    })

    // 点击编辑按钮
    $('.list').on('click', '.showModal', function () {
        console.log(endPage);

        //获取当前页
        var editPageNum = $('.isPage').val();
        $('#formEdit input').val('');
        $('#formEdit .outer select').html('<option>请选择</option>')
        var itemId = $(this).parent().parent().attr('id');
        // console.log(itemId);
        //弹出编辑模态框
        $('#edit').modal();

        var editSelector = {
            operate:'edit',
            unitName: '#edit_unit',
            datatype: '#edit_datatype',
            indusName: '#edit_indusName',
            indexName: '#edit_indexName',
            province: '#edit_province',
            city: '#edit_city',
            county: '#edit_county'
        }
        //编辑时项目渲染
        getItemData(editSelector, function () {
            // var itemId = This.
            var itemData = {
                url: url+'/itemUpdateView',
                data: itemId,
                success: function (itemResult) {
                    console.log(itemResult);
                    
                    // $('#edit_unit').val(itemResult.itemUnit);
                    editSecDraw('#edit_unit',itemResult.itemUnit)
                    editSecDraw('#edit_fre',itemResult.frequencyName)
                    editSecDraw('#edit_datatype',itemResult.datatypeName)
                    editSecDraw('#edit_indusName',itemResult.indusName)
                    editSecDraw('#edit_indexName',itemResult.indexCode)
                    function editSecDraw(selector,data){
                        if(data!=null){
                            $(selector).val(data)
                        }else{
                            // $(selector).val('<option>请选择</option>');
                        }
                    }
                    
                    $('#formEdit input[name="itemName"]').val(itemResult.itemName);
                    // $('#formEdit input[name="itemUnit"]').val(itemResult.unitName);
                    $('#formEdit input[name="itemUnit"]').val(itemResult.itemUnit);
                    $('#formEdit input[name="itemCode"]').val(itemResult.itemCode);

                    //渲染地区数据 获取地区长度
                    var areaLength = itemResult.areaView.length;
                    console.log(areaLength);
                    if (areaLength == 3) {
                        var proJson = itemResult.areaView[0];
                        $('#edit_province').val(proJson.areaName);

                        //通过传过来的省id获取渲染全部市，并显示默认市
                        var proId = $('#edit_province').find('option:selected').attr('proId');
                        console.log(proId)
                        var getCityData = {
                            url: url+'/getArea',
                            data: {
                                areaId: proId
                            },
                            success: function (result) {
                                console.log(result)
                                var city = template('city-list', {
                                    city_list: result
                                });
                                // console.log(city);
                                // 渲染全部市
                                $('#edit_city').html(city)
                                //显示默认市
                                var cityJson = itemResult.areaView[1];
                                $('#edit_city').val(cityJson.areaName);

                                //通过获取到市id渲染全部的县，并显示默认县
                                var cityId = itemResult.areaView[1].areaId;
                                console.log(cityId);
                                var getEditCountyData = {
                                    url: url+'/getArea',
                                    data: {
                                        areaId: cityId
                                    },
                                    success: function (result) {
                                        // alert(1);
                                        console.log(result)
                                        var county = template('county-list', {
                                            county_list: result
                                        });
                                        // 渲染全部市
                                        $('#edit_county').html(county)
                                        //显示默认市
                                        var countyJson = itemResult.areaView[2];
                                        $('#edit_county').val(countyJson.areaName)
                                    }
                                }
                                $.ajax(getEditCountyData)
                            },
                            error: function () {
                                console.log(error);
                            }
                        }
                        $.ajax(getCityData)
                    } else if (areaLength == 2) {
                        //显示省
                        var proJson = itemResult.areaView[0];
                        $('#edit_province').val(proJson.areaName)

                        //通过传过来的省id获取市，并显示默认市
                        var proId = $('#edit_province').find('option:selected').attr('proId');
                        console.log(proId)
                        var getCityData = {
                            url: url+'/getArea',
                            data: {
                                areaId: proId
                            },
                            success: function (result) {
                                console.log(result)
                                var city = template('city-list', {
                                    city_list: result
                                });
                                // console.log(city);
                                // 渲染全部市
                                $('#edit_city').html(city)
                                //显示默认市
                                var cityJson = itemResult.areaView[1];
                                $('#edit_city').val(cityJson.areaName)
                            }
                        }
                        $.ajax(getCityData)
                        //显示市
                        // var cityJson=itemResult.areaView[1];
                        // $('#edit_city').html('<option>'+cityJson.areaName+'</option>')
                    } else if(areaLength ==1){
                        console.log('进来了')
                        var proJson = itemResult.areaView[0];
                        $('#edit_province').val(proJson.areaName)
                        $('#formEdit input[name="areaName"]').val(proJson.areaId);
                        //通过传过来的省id获取渲染全部市，并显示默认市
                        var proId = itemResult.areaView[0].areaId;
                        console.log(proId)
                        var getCityData = {
                            url: url+'/getArea',
                            data: {
                                areaId: proId
                            },
                            success: function (result) {
                                console.log(result)
                                var city = template('city-list', {
                                    city_list: result
                                });
                                // console.log(city);
                                // 渲染全部市
                                $('#edit_city').html('<option>请选择</option>' + city)
                            },
                            error: function () {
                                console.log(error);
                            }
                        }
                        $.ajax(getCityData)
                    //没有地区的情况
                    }else{
                        console.log('不用做什么');
                    }
                },
                error: function (error) {
                    console.log(error)
                }
            }
            $.ajax(itemData);
        })
        // 点击更新按钮
        $('#update').click(function () {
            if (!$.trim($('#edit input[name="itemName"]').val())) {
                alert('请输入项目名称')
                return
            }
            // console.log(itemId);
            $("#itemId").val(itemId)
            $('#edit .unit').val($('#edit_unit option:selected').attr('unitId'));
            $("#edit .frequency").val($("#edit_fre option:selected").val());
            $("#edit .datatype").val($("#edit_datatype option:selected").attr('typeId'));
            $("#edit .industry").val($("#edit_indusName option:selected").attr('indusId'));
            $("#edit .indexName").val($("#edit_indexName option:selected").attr('indexId'));
            var countyId = $("#edit_county option:selected").attr('countyId')
            var cityId = $("#edit_city option:selected").attr('cityId')
            var proId = $("#edit_province option:selected").attr('proId')
            if (countyId) {
                $("#edit .area").val(countyId)
            } else if (cityId) {
                $("#edit .area").val(cityId)
            } else if (proId) {
                $("#edit .area").val(proId)
            } else {
                alert('请填入项目所属区域')
                return
            }

            var editFormData = $('#formEdit').serialize();
            console.log(editFormData);
            var updataData = {
                url: url+'/updateItemSave',
                type: 'post',
                data: editFormData,
                success: function (result) {
                    // console.log(result);
                    skipByPageNum();
                }
            }
            $.ajax(updataData);
            $('#edit').modal('hide')

        })
    })

    //点击删除按钮
    $('.list').on('click', '.delete', function () {
        if (confirm("确定删除数据")) {
            var deleteId = $(this).parent().parent().attr('id');
            console.log(deleteId);
            var deleteData = {
                url: url+'/deleteItemList',
                type: 'post',
                data: deleteId,
                success: function (result) {
                    console.log(result)
                    // $.ajax(getIndexData)
                    // alert('删除成功')
                    if (result.status === 'success') {
                        alert('删除成功');
                        searchCon = $(".itemName").val()
                        //根据搜索框内容重新加载
                        pageNum=parseInt($('.isPage').text())
                        fuzzyGetHomePage({
                            pageNum: pageNum,
                            pageSize: pageSize,
                            searchId: searchId,
                            searchName:searchCon
                        });
                    } else if (result.status === 'fail') {
                        alert('删除失败')
                    }
                    
                },
                error: function (error) {
                    consoel.log(error)
                }
            }
            $.ajax(deleteData)
            //删除后进行页面渲染
            pageNum = 1;
            // $.ajax(getIndexData)
            // $.ajax(getIndexData);
        }
        

    })


    //搜索框输入内容功能 
    var preVal = '',
        nowVal = '',
        searchId;
    $('.itemName').keyup(function () {
        searchId = undefined;
        var nowVal = $(this).val();
        if (!$.trim(nowVal)) {
            $('.searchTips').hide();
            return;
        }
        //键盘每次up一下就判断两次输入的内容，不一样时执行代码
        else if ($.trim(preVal) != $.trim(nowVal)) {
            preVal = nowVal
            var getTipsCon = {
                url: url+'/tipFindItem',
                data: {
                    searchId: searchId,
                    searchName: nowVal
                },
                success: function (result) {
                    //数组格式
                    console.log(result);
                    if (result) {
                        $('.searchTips').show();
                        var search_tips = template('search-tips', {
                            list: result
                        });
                        $('.searchTips').html(search_tips);

                        //选中提示功能
                        $('.searchTips').on('click', 'button', function () {

                            var tipName = $(this).text();
                            searchId = $(this).attr("tipsId")
                            pageNum = 1;
                            // console.log($(this).text())
                            $('.searchTips').hide();
                            $('.itemName').val(tipName);
                            searchCon=$('.itemName').val();
                            fuzzyGetHomePage({
                                pageNum: pageNum,
                                pageSize: pageSize,
                                searchId: searchId,
                                searchName:searchCon
                            })
                        })
                    }

                },
                error: function (error) {
                    console.log(error);
                }
            }
            $.ajax(getTipsCon)
        }
    })

    //搜索功能
    $('.searchBtn').click(function () {
        searchCon = $(".itemName").val()
        console.log(searchCon)
        if (!$.trim(searchCon)) {
            alert('搜索内容不能为空')
            return
        } else {
            pageNum=1;
            fuzzyGetHomePage({
                pageNum: pageNum,
                pageSize: pageSize,
                searchId: searchId,
                searchName:searchCon
            });
            $('.searchTips').hide();
        }
    })


    //跳转到指定页
    function skipByPageNum() {
        pageNum = $('.gotoPage').val();
        var currentNum = $('.isPage').val();
        searchCon=$('.itemName').val();
        fuzzyGetHomePage({
            url:url+'findItem',
            pageNum: pageNum || currentNum,
            pageSize: pageSize,
            searchId: searchId,
            searchName:searchCon,
            whichSingle:'#total-manage '
        });
    }
    //模糊查询
    // function fuzzyGetHomePage(options) {
    //     // console.log(options.searchName);
    //     // var searchName = $('.itemName').val();
    //     // console.log(searchName)
    //     // console.log(options.searchId);
    //     //模糊查询
    //     var getDataByFuzzy = {
    //         url: url+'/findItem',
    //         data: {
    //             pageNum: options.pageNum || 1,
    //             pageSize: options.pageSize || 15,
    //             searchId: options.searchId,
    //             searchName: options.searchName
    //         },
    //         type: 'post',
    //         // beforeSend: function () {
    //         //     $('.loading').show();
    //         // },
    //         success: function (result) {
    //             console.log(result);
                
    //             var html = template('data-list', {
    //                 list: result.list
    //             });
    //             $('#list').html(html);
    //             //计算尾页
    //             endPage = Math.ceil(result.total / options.pageSize);
    //             console.log(endPage);
    //             console.log(options.pageNum)
    //             $('.isPage').text(options.pageNum)
    //             $('.allPage').text(result.allPage)

    //             if(result.total==0){
    //                 alert('没有数据，点击确定返回首页')
    //                 fuzzyGetHomePage({
    //                     pageNum: 1,
    //                     pageSize: pageSize,
    //                 })
    //                 $('.itemName').val('');
    //             }
    //         },
    //         error: function (error) {
    //             console.log(error)
    //         },
    //         // complete: function () {
    //         //     $('.loading').hide();
    //         // }
    //     };
    //     $.ajax(getDataByFuzzy);
    // }
    //点击展开收缩
    $('.navs ul li ul li a').click(function () {
        return false;
    })
    $('.navs').children('ul').children('li').children('a').click(function (event) {
        // event.preventDefault();

        $(this).next().toggle();
        // return false;   
    })


})