$(function(){
    // 给登录和注册中的a链接绑定点击事件
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    
    $('#link_login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 在layui中获取对象
    var form = layui.form
    var layer = layui.layer
     // 自定义验证规则 
    form.verify({
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        repwd: function(value){
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致!'
            }
        }

    })

    // 给注册表单绑定提交事件
    $('#form_reg').on('submit',function(e){
        e.preventDefault()
        var data = {username:$('#form_reg [name=username]').val(),
        password:$('#form_reg [name=password]').val()}
        $.post('/api/reguser',data,
            function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录!')
                $('#link_login').click()
            })
    })

    // 给登录表单绑定提交事件
    $('#form_login').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res){
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg('登录失败!')
                }
                layer.msg('登录成功!')
                localStorage.setItem('token',res.token)
                location.href = '/index.html'
            }
        })
    })

})