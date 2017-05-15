# 优惠券，交换券预览

## API 

属性|必填|说明|类型|默认值
----|----|---|-----
sourceData|是|优惠券信息数据|object|-
height|否|券高度|string|200
width|否|券宽度|string|400
isOpend|否|使用规则是否展开|bool|true

sourceData具体属性见下表

属性|必填|说明|类型|默认值
----|----|---|-----
couponTitle|是|券标题|string|XXXXXXXXXXXXX
discountWeight|是|券金额|string/number|N
endDate|是|活动结束日期|string|-
validTime|否|活动在结束日期后多少天内有效|number|0
useFloor|否|使用门槛|string/number|下单后直接使用
roles|否|使用规则|array|-
