$(function(){
    // 获取layui的form对象
    var form = layui.form
    // 自定义输入框规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        samePwd: function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }  
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit',function(){
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.stutas !== 0){
                    return layui.layer.msg('修改密码失败!')
                }
                layui.layer.msg('修改密码成功!')
                $('.layui-form')[0].reset()
            }
        })
    })
})