# UploadImage 图片上传
点击上传图片 

## API
属性|必填|说明|类型|默认值
----|----|---|-----
beforeUpload|否|上传之前的钩子函数，一般用于loading效果|func|-
success|是|图片上传成功后的钩子函数,第一个参数为图片ID ,第二个为图片地址|func|-                       
error|否|上传失败的钩子函数,参数为报错msg|func|-                       
end|否|上传完成钩子函数,用于取消loading效果|func|-                    
width|否|上传组件的宽|number|202|-
height|否|上传组件的高|number|180|-
action|是|上传的接口|string|-                    
IconType|否|上传组件默认的Icon图标|string|"plus"|
value|是|上传的图片的地址|string| 

                    
## 说明
                   
 
