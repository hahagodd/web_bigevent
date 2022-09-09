$(function(){
    var layer = layui.layer
    var form = layui.form

    initArtCateList()
    // 获取文章分类列表
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layui.layer.msg('获取列表失败！')
                }
                var htmlStr = template('tel-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var addIndex = null
    // 未添加类别按钮绑定点击事件
    $('#btnAddCate').on('click',function(){
        addIndex=layer.open({
                    type: 1,
                    area: ['500px', '300px'],
                    title: '添加文章分类',
                    content: $('#dialog-add').html()
                }); 
            })

    // 监听表单的提交事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('添加文章分类失败！')
                }
                layer.close(addIndex)
                initArtCateList()    
            }
        })
    })

    var editIndex = null
    // 委托给动态添加的编辑按钮绑定点击事件
    $('tbody').on('click','.btn-edit',function(e){
        e.preventDefault()
        editIndex=layer.open({
                    type: 1,
                    area: ['500px', '300px'],
                    title: '添加文章分类',
                    content: $('#dialog-edit').html()
        }); 
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/'+id,
            success: function(res){
                form.val('form-edit', res.data);
            }
        })
    })

    // 委托给动态添加的弹出层修改表单添加监听事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新文章分类失败！')
                }
                layer.close(editIndex)
                initArtCateList() 
            }
        })
    })

    // 委托给动态添加列表的删除按钮绑定点击事件
    $('tbody').on('click','.btn-delet',function(){
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/'+id ,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index);
                    initArtCateList() 
                }
            }) 
          });
    })
})