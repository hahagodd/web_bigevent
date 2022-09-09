$(function(){
    // 定义一个查询的对象，需要将请求参数提交到服务器
    var q = {
        pagenum: 4,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage 
    // 将格式标准化
    template.defaults.imports.dateFormat=function(date){
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth()+1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss
    }
    // 补0函数
    function padZero(n){
        return n<10? '0'+n:n
    }

    initTable()
    // 向服务器发送请求，获取列表数据
    function initTable(){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res){
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg('获取文章的列表数据失败！')
                }
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                // 调用分页函数
                renderPage(res.total)
            }
        })
    }

    initCate()
    // 获取文章分类
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章分类失败!')
                }
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 监听表单提交事件
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 分页
    function renderPage(total){
        laypage.render({
            elem : 'pageBoxs',
            count : total,
            limit : q.pagesize,
            curr : q.pagenum,
            layout: ['count','limit','prev', 'page', 'next','skip'],
            limits: [2,3,4,5,6],
            jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //首次不执行
                if(!first){
                    initTable()
                }
              }
        }) 
    }

    // 委托给动态添加列表的删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(){
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        console.log(len);
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/'+id,
                success: function(res){
                    console.log(res);
                    if(res.status !== 0){
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!')

                    if(len === 1){
                        q.pagenum = q.pagenum === 1?  q.pagenum:q.pagenum-1
                    }
                    initTable()
                }
            })
            
            layer.close(index);
          });

       
    })
})