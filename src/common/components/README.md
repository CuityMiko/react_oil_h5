 # 加油站H5公共组件使用说明
 ## 1.NotFound(404页面组件)
   > - 组件使用场景：当路由找不到时跳转到404页面
   > - 参数：不需要传参
   > - 使用方法：<Route path="/404" component={NotFound} />或<NotFound />
   
 ## 2.BorderItem(带border的标题展示组件)
   > - 组件使用场景：用于兑换油站及积分须知弹窗前面带border的标题展示
   > - 参数：text(必传，string类型，标题)、customClass(string，提供自定义样式
       类，比如可用于改变title的样式)
   > - 使用方法：<BorderItem text="汽油卡" customClass="station-border-item" />
   
 ## 3.BottomContent(固定在屏幕底部的content组件)
   > - 组件使用场景：适用于固定在屏幕底部的content，如提货码页面下方的立即兑换
   > - 参数：buttonIsBehind(bool类型，按钮是在前部还是在后部，默认在后部，如果按钮在前
       部则传入false)、customClass(string类型，提供自定义样式类)
   > - 使用方法：<BottomContent customClass="bottom-content">任意元素
       </BottomContent>
       
 ## 4.Card(会员卡展示组件)
   > - 组件使用场景：用于登录及首页页面会员卡的展示
   > - 参数：cardObj(object型，{logo: 加油站的logo（必填）title: 加油站的名
       称（必填）phone: 会员手机号（必填）bgImg: 卡片背景图（选填） --默认为红色背景
       图})、defineArea(element型，卡片最右侧提供自定义（选填）--默认为空)
   > - 使用方法：<Card cardObj={card对象} />
   
 ## 5.CouponComponent(卡券展示组件)(couponItem对象组成部分需要接着看嵌套的组件确定)
   > - 组件使用场景：用于卡券形式的展示
   > - 参数：couponItem(必传，object型，用于传给LeftCouponComponent组件的数据源)、
       useScene(枚举，组件适用场景，可选值gift-coupon(赠送卡券)、share-coupon(分
       享卡券)、invalid-coupon(卡券已作废)、coupon(卡券)，默认为coupon)、
       customClass(string型，提供左侧自定义样式类)、handleClick(func型，点击卡券
       左边部分进行的回调函数) ps:只有share-coupon场景右边内容为空，无需传children
   > - 使用方法：<CouponComponent useScene="gift-coupon" couponItem={couponItem}>
       children元素</CouponComponent>
   
 ## 6.DetailItem(详情key-value模块组件)
   > - 组件使用场景：用于卡券详情/提货码详情中展示key/value的键值对
   > - 参数：detailItems(必传，object型，map结构，[key, value])、customClass(string
       类型，提供自定义的样式类)、提供children，可以传入Field组件
   > - 使用方法：var data = new Map().set('key1','value1').set('key2','value2') 
       <DetailItem detailItems={data}>children可传可不传</DetailItem>
        
 ## 7.Error(错误组件)
   > - 组件使用场景：静态错误页
   > - 参数：无参
   > - 使用方法：<Error />   
       
 ## 8.PayError(付款失败组件)
   > - 组件使用场景：付款失败时出现的失败页面
   > - 参数：无参
   > - 使用方法：<PayError /> 
       
 ## 9.Field(快速构建一行字段组件)
   > - 组件使用场景：快速构建一行字段，一行space-between布局，居左是图片(可没有)+文本，居右是children
   > - 参数：text(必传，string型，filed的文本)、customClass(string型，自定义类)、
       imgSrc(string型，图片url)、subtext（string型，控制text文本需要显示不同字
       体大小或颜色的情况，如：积分明细和充值明细）、imgAlt(string型，图片提示)、
       handleClick(func型，回调函数)，可以传children
   > - 使用方法：<Field imgSrc={info_icon} text="兑换说明" customClass="mall-detail-field" />
       children可传可不传</Field>
   
 ## 10.LeftCouponComponent(卡券左部分展示组件)
   > - 组件使用场景：用于卡券左边部分的展示
   > - 参数：couponItem(必传，object型，卡券的数据，包含的字段amount-卡券金额、
       leastCost-满xxx可用、name-卡券名称、date-有效日期、applyGoods-适用油
       品)、customClass(必传，string型，提供修改样式)、handleClick(func型，
       点击卡券左边部分进行的回调函数)
   > - 使用方法：<LeftCouponComponent customClass="gift-coupon" 
       couponItem={couponItem} handleClick={handleClick} />
   
 ## 11.LoginForm(登录表单验证组件)
   > - 组件使用场景：用于登录时的表单验证
   > - 参数：useScene(枚举型，可选'login', 'share'，在登录时 或分享时登录用，
       默认值为login,样式为白底黑字，可选为share,选为share时样式会发生变化，样
       式为透明底白字)、title(必传，string型，button的文字)、couponNumber(
       string型，用于分享卡券登录场景时使用)、history(object型，用于页面跳转
       history.push)
   > - 使用方法：<LoginForm title="立 即 领 取" history={history} />
   
 ## 12.MobileButton(按钮组件)
   > - 组件使用场景：手机端加油站不同样式的按钮
   > - 参数：text(必传，string型，按钮的文本)、handleClick(必传，func型，
       点击按钮出发的回调事件)、buttonClass(必传，枚举型，可选'longButton-橙色
       长按钮eg:立即激活', 'emptyButton-中空长按钮eg:快速充值', 
       'shortButton-橙色小按钮eg:去使用', 'businessButton-业务按钮
       eg:积分须知，前往充值')、disabled(bool型，按钮是否可用，默认false)、
       isRound(bool型，按钮是否是圆角，默认true)、icon(element型，按钮的右
       侧放置icon)、customClass(string型，按钮的自定义的class类)
   > - 使用方法：<MobileButton text="aa" icon={this.arrowIcon()} 
       handleClick={buttonClick} buttonClass="ss" customClass="dd" />
   
 ## 13.PopupComponent(弹窗组件)
   > - 组件使用场景：用于弹出消息提醒
   > - 参数：visible(必传，bool型，弹窗是否可见，默认为false)、onClose(必传，
       func型，点击下方x号的回调函数)、direction(枚举型，可选'center', 
       'flex-start', 'flex-end'，内容区的排列)
   > - 使用方法：<PopupComponent visible={true} direction="center" 
       onClose={this.onClose('modal')}>可传children</PopupComponent>
   
 ## 14.QRBarCode(二维码/条形码组件)
   > - 组件使用场景：根据后端返回数据，前端生成二维码或条形码
   > - 参数：codeVal(string型，码值)、codeType(枚举型，码类型，qrcode-二维码、
       jsbarcode-条形码)
   > - 使用方法：<QRBarCode codeVal="dskdskddsjd" codeType="jsbarcode"/>
   
 ## 15.StationContent(适用油站的界面展示组件)
   > - 组件使用场景：用于适用油站的数据展示，整体界面
   > - 参数：stationItems(必传，对象组成的数组型，其中对象的具体字段可参考
       StationItem组件，适用油站的数据数组)、fieldName(必传，string型，
       field文本)、customClass(string型，提供自定义的样式类)
   > - 使用方法：<StationContent stationItems={stationItems} 
       fieldName="兑换油站" customClass="aa"></StationContent>
   
 ## 16.StationItem(适用油站的数据展示组件)
   > - 组件使用场景：用于适用油站的数据展示
   > - 参数：stationItem(必填，object型，其字段stationName-加油站名称，
       address-加油站地址，tel-加油站电话)、
   > - 使用方法：<StationItem stationItem={stationItem} key={index} />
   
 ## 17.StorePointDetail(充值及积分明细详情组件)
   > - 组件使用场景：用于积分明细详情以及充值明细详情的展示
   > - 参数：type(必传，string型，可选'point', 'store')、number(必传，
       number型，积分或金额变动值)、history(object型，用于页面跳转)、
       itemsMap(必传，object型，map型的key-value键值对)
   > - 使用方法：<StorePointDetail type="point" itemsMap={itemsMap} 
       history={history} number={this.getNumber(listItems)} />
   
 ## 18.StorePointListHeader(积分明细和充值明细列表头部展示组件)
   > - 组件使用场景：用于积分明细和充值明细列表头部的展示
   > - 参数：fieldImg(必传，string型，field组件的icon)、fieldText(必传，
       string型，field组件的text)、fieldSubtext(必传，string型，
       field组件的subtext)、buttonText(必传，string型，button组件的文本)、
       buttonClick(必传，func型，button组件的点击事件)
   > - 使用方法：<StorePointListHeader fieldImg="**.jpg"
       fieldText="dd" fieldSubtext="积分" buttonText="积分须知"
       buttonClick={this.showModal('modal')} />
   
 ## 19.StorePointListItem(积分-储值列表的单项内容组件)
   > - 组件使用场景：用于积分明细列表和充值明细列表下的item展示
   > - 参数：item(必传，object，具体类型定义title-文本 time-时间
       data-右侧数据)、handleClick(必传，func型，点击item时进行的回调函数)
   > - 使用方法： <StorePointListItem item={item} key={index}
       handleClick={itemHandleClick(item.id)} />
       
  ## 20.StorePointListTab(积分-储值列表tab数据展示组件)
   > - 组件使用场景：用于充值/积分明细列表tab下的数据展示
   > - 参数：dataItems(必传，array型，全部的数据)、dataItemsIncrease(必传，
       array型，增加的数据)、dataItemsDecrease(必传，array型，减少的数据)、
       itemHandleClick(必传，func型，点击item进行的回调函数)、onTabClick(
       必传，func型，点击tab进行的回调函数)
   > - 使用方法：<StorePointListTab dataItems={dataSource}
       dataItemsIncrease={dataSource1} dataItemsDecrease={dataSource2}
       itemHandleClick={this.handleClick} onTabClick={this.onTabClick} />  
       
  
 