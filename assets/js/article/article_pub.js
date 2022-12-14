$(function(){
    var layer = layui.layer
    var form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()

     // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给服务器发送请求，获取文章类别
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章分类失败！')
                }
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 给文章封面板块的选择封面按钮绑定点击事件
    $('#btnChooseImg').on('click',function(){
        $('#coverFile').click()
    })

    // 监听file输入框的change事件
    $('#coverFile').on('change',function(e){
        var files = e.target.files
        if(files.length === 0){
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

    })

    // 发布文章的状态
    var art_state = '已发布'
    $('#btnSave2').on('click',function(){
        art_state = '草稿'
    })

    // 为表单绑定 submit 提交事件

    $('#form-pub').on('submit ',function(e){
        e.preventDefault()
        // 创建newData实例,处理需要发送给服务器的数据
        var fd = new FormData($(this)[0])
        fd.append('state',art_state)
        // 将封面裁剪过后的图片，输出为一个文件对象
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img',blob)
            // 发送文章
            publishArticle()
        })

        // 定义发送文章函数
        function publishArticle(){
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                contentType : false,
                processData : false,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('发布文章失败!')
                    }
                    layer.msg('发布文章成功!')
                    location.href = '/article/article_list.html'
                }

            })
        }
    })
    
})