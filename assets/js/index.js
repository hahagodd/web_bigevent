$(function(){
    // 获取用户信息
    getUserInfo()
    // 获取layui的layer对象
    var layer = layui.layer
    // 给退出按钮绑定退出事件
    $('#btn-logout').on('click',function(){
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            // 清除本地存储里面token
            localStorage.removeItem('token')
            // 返回登录页面
            location.href = '/login.html'
            layer.close(index);
          });
    })
})

// 获取用户信息
function getUserInfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败!')
            }
            // 渲染用户头像
            renderAvatar(res.data)
        },
        // complete: function(res){
        //     console.log(res);
        //     // if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!'){
        //     //     // 强制清空token
        //     //     localStorage.removeItem('token')
        //     //     // 强制跳转到登录页面
        //     //     location.href = '/login.html'
        //     // }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user){
    var name = user.nickname||user.username
    $('#welcome').html('欢迎'+name)
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        $('.text-avatar').html(name[0].toUpperCase())
        $('.layui-nav-img').hide()
    }
}