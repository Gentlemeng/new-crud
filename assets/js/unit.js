
//封装
    var url="http://192.168.1.127:8905";
    var pageSize = 10;
    //1.通过选择器获取元素，请求数据并动态渲染到元素上
    function getItemData(option, fn) {
        var getAddData = {
            url: 'http://192.168.1.127:8905/addItemEdit',
            type: 'get',
            success: function (result) {
                console.log(result);
                var unitName = template('unit-list', {
                    //数组
                    unit_list: result.baseUnit
                });
                    $(option.unitName).html('<option>请选择</option>'+unitName)
    
                var dataType = template('type-list', {
                    //数组
                    data_list: result.dataType
                });
                $(option.datatype).html('<option>请选择</option>'+dataType)

                var indusName = template('indus-list', {
                    //数组
                    indus_list: result.industry
                });
                $(option.indusName).html('<option>请选择</option>'+indusName)

                var indexName = template('index-list', {
                    //数组
                    index_list: result.index
                });
                $(option.indexName).html('<option>请选择</option>'+indexName)

                var province = template('pro-list', {
                    //数组
                    pro_list: result.area
                });
                $(option.province).append(province)
            },
            error: function (error) {
                console.log(error)

            },
            complete: function () {
                //编辑页中还需要通过省来获取全部市的数据，通过市来获取县
                if (fn) {
                    fn();
                }
            }
        }
        $.ajax(getAddData);

        // 获取市
        $(option.province).change(function () {
            //清空 市、县
            $(option.city).val('')
            $(option.county).html('<option>请选择</option>')
            // alert(1)
            var proId = $(option.province).find('option:selected').attr('proId');
            // console.log(proId)
            var getCityData = {
                url: 'http://192.168.1.127:8905/getArea',
                data: {
                    areaId: proId
                },
                success: function (result) {
                    console.log(result)
                    var city = template('city-list', {
                        city_list: result
                    });
                    // console.log(city);
                    $(option.city).html('<option>请选择</option>' + city)
                }
            }
            $.ajax(getCityData)
        })

        //获取县（区）
        $(option.city).change(function () {
            var cityId = $(option.city).find('option:selected').attr('cityId')
            // console.log(cityId)
            var getCountyData = {
                url: 'http://192.168.1.127:8905/getArea',
                data: {
                    areaId: cityId
                },
                success: function (result) {
                    console.log(result)
                    var county = template('county-list', {
                        county_list: result
                    });
                    $(option.county).html('<option>请选择</option>' + county)
                }
            }
            $.ajax(getCountyData)
        })
        
    }
    //
    function fuzzyGetHomePage(options) {
        // console.log(options.searchName);
        // var searchName = $('.itemName').val();
        // console.log(searchName)
        // console.log(options.searchId);
        //模糊查询
        var getDataByFuzzy = {
            url: options.url,
            data: {
                typeFlag:options.typeFlag,
                pageNum: options.pageNum || 1,
                pageSize: options.pageSize || 15,
                searchId: options.searchId,
                searchName: options.searchName
            },
            type: 'post',
            // beforeSend: function () {
            //     $('.loading').show();
            // },
            success: function (result) {
                console.log(result);
                
                var html = template('data-list', {
                    list: result.list
                });
                $(options.whichSingle+'.list').html(html);
                //计算尾页
                endPage = Math.ceil(result.total / options.pageSize);

                console.log(endPage);
                // console.log(options.pageNum)
                $(options.whichSingle+'.record').attr({"endPage":endPage})
                $(options.whichSingle+'.record').attr({"currentPage":options.pageNum})
                $(options.whichSingle+'.isPage').text(options.pageNum)
                $(options.whichSingle+'.allPage').text(result.allPage)

                if(result.total==0){
                    // alert('没有数据，点击确定返回首页')
                    // fuzzyGetHomePage({
                    //     url:options.url,
                    //     pageNum: 1,
                    //     pageSize: options.pageSize,
                    // })
                    // $('.itemName').val('');
                }
            },
            error: function (error) {
                console.log(error)
            },
            // complete: function () {
            //     $('.loading').hide();
            // }
        };
        $.ajax(getDataByFuzzy);
    }

    //单表管理中的首页/上一页/下一页/尾页/跳转
    function updownPage(that,url) {
        
        var id = '#' + that.closest('.panel').attr('id');
        var mark = id.charAt(id.length - 1);
        var pageNum=parseInt($(id+' .record').attr('currentPage'));
        var endPage=parseInt($(id+" .record").attr('endPage'))
        // $(id+' .record').attr({'endPage':})
        switch (mark) {
            case "1":
                typeFlag = "unit";
                searchId=undefined;
                searchCon=undefined;
                break;
            case "2":
                typeFlag = "datatype";
                searchId=undefined;
                searchCon=undefined;
                break;
            case "3":
                typeFlag = "industry";
                searchId=undefined;
                searchCon=undefined;
                break;
            case "4":
                typeFlag = "index";
                searchId=undefined;
                searchCon=undefined;
                break;
            default:
                typeFlag = undefined;
                searchId=undefined;
                var searchCon=$('.itemName').val();
                break;
        }
        if (that.attr('class') == "previous") {
            if (pageNum == "1") {
                alert('当前页为首页')
                return false;
            } else {
                pageNum--;
            }
        } else if (that.attr('class') == "next") {
            if (pageNum >= endPage) {
                alert('当前页为最后一页')
                return;
            } else {
                pageNum++;
            }
        }else if(that.attr('class')=="homePage"){
            fuzzyGetHomePage({
                url: url,
                pageNum: 1,
                pageSize: pageSize,
                typeFlag: typeFlag,
                searchId: searchId,
                searchName:searchCon,
                whichSingle: id+' '
            });
            $(id+' .record').attr({'currentPage':pageNum})
            return;
        }else if(that.attr('class')=='end'){
            fuzzyGetHomePage({
                url: url,
                pageNum: endPage,
                pageSize: pageSize,
                typeFlag: typeFlag,
                searchId: searchId,
                searchName:searchCon,
                whichSingle: id+' '
            });
            $(id+' .record').attr({'currentPage':endPage})
            return;
        }else if(that.attr('class')=='go'){
            var gotoPageVal=$(id+' .gotoPage').val();
            // console.log(gotoPageVal)
            // (
            if($.trim(gotoPageVal)==''||(parseInt(gotoPageVal)<1||parseInt(gotoPageVal)>endPage)){
                alert('请输入正确页码')
                return;
            }else{
                fuzzyGetHomePage({
                    url: url,
                    pageNum: gotoPageVal,
                    pageSize: pageSize,
                    typeFlag: typeFlag,
                    whichSingle: id+' '
                });
                $(id+' .record').attr({'currentPage':gotoPageVal})
                $(id+' .gotoPage').val('');
                return;
            }
        }
        // $(id+' .record').attr({'currentPage':pageNum})
        // console.log(url)
        fuzzyGetHomePage({
            url: url ,
            pageNum: pageNum,
            pageSize: pageSize||10,
            typeFlag: typeFlag,
            searchId: searchId,
            searchName:searchCon,
            whichSingle: id+' '
        })
    }
    

    //2.计算json对象的长度
    function jsonLength(json) {
        var jsonLength = 0;
        for (var k in json) {
            jsonLength++;
        }
        return jsonLength;
    }

    
   