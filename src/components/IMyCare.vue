<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="IGrid_app">
        <van-grid :gutter="propData.gutter" :border="false" :column-num="propData.showColumn">
            <van-grid-item v-for="(item,index) in data_list" :key="index">
                <div @click="clickGrid(item)" class="grid_list flex_between">
                    <div v-if="propData.showImage" class="grid_list_left flex_start">
                        <img v-if="getImageUrl(item)" :src="getImageUrl(item)" alt=""/>
                    </div>
                    <div class="grid_list_right">
                        <div class="top flex_between">
                            <div class="name">{{ item[propData.dataFieldName ? propData.dataFieldName : 'name'] }}</div>
                            <div v-if="propData.showOperatorButton" class="operator">
                                <div @click="cancel" v-if="item[propData.dataFieldCare ? propData.dataFieldCare : 'care']" class="cancel flex_center">
                                    <span>取消关注</span>
                                </div>
                                <div @click="care" v-else class="care flex_center">                     
                                    <span>取消关注</span>
                                </div>
                            </div>
                        </div>
                        <div v-if="propData.showIntegral" class="bottom">
                            <div class="row title flex_start">
                                <div class="label">称号：</div>
                                <div class="value">{{ item[propData.dataFieldTitle ? propData.dataFieldTitle : 'title'] }}</div>
                            </div>
                            <div class="row integral flex_start">
                                <div class="label">积分：</div>
                                <div class="value">{{ item[propData.dataFieldIntegral ? propData.dataFieldIntegral : 'integral'] }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </van-grid-item>
        </van-grid>
    </div>
</template>
  
<script>
import { getGridData } from '../mock/mockData'
export default {
    name: 'IMyCare',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                gutter: 10,
                showColumn: 3,
                showRows: 0,
                showImage: true,
                loadDataCreated: true,
                showIntegral: true,
            },
            data_list: [],
            demand_params: {},
            conditionObject: {},
        }
    },
    props: {
    },
    watch: {
        'propData.showRows': function(value,old) {
            this.changeLines()
        },
    },
    created() {
        this.moduleObject = this.$root.moduleObject;
        this.convertAttrToStyleObject();
        if ( this.propData.loadDataCreated ) {
            this.initData()
        }
    },
    mounted() {
        this.$nextTick(function (params) {

        });
    },
    destroyed() { },
    methods: {
        getImageUrl(item) {
            if ( item[this.propData.dataFieldImageUrl ? this.propData.dataFieldImageUrl : 'imageUrl'] ) {
                return IDM.url.getWebPath(item[this.propData.dataFieldImageUrl ? this.propData.dataFieldImageUrl : 'imageUrl'])
            } else {
                return IDM.url.getModuleAssetsWebPath(require(`../assets/default_avatar.png`),this.moduleObject)
            }
        },
        care() {
            if( this.moduleObject.env=="develop" ){
                return;
            }
            let that = this;
            let urlObject = window.IDM.url.queryObject(),
            pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
            var clickFunction = this.propData.clickFunctionCare;
            clickFunction&&clickFunction.forEach(item=>{
                window[item.name]&&window[item.name].call(this,{
                    urlData:urlObject,
                    pageId,
                    customParam:item.param,
                    _this:this
                });
            })
        },
        cancel() {
            if( this.moduleObject.env=="develop" ){
                return;
            }
            let that = this;
            let urlObject = window.IDM.url.queryObject(),
            pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
            var clickFunction = this.propData.clickFunctionCancel;
            clickFunction&&clickFunction.forEach(item=>{
                window[item.name]&&window[item.name].call(this,{
                    urlData:urlObject,
                    pageId,
                    customParam:item.param,
                    _this:this
                });
            })

        },
        clickGrid(item) {
            if ( item[this.propData.dataFieldUrl ? this.propData.dataFieldUrl : 'jumpUrl'] ) {
                window.open(item[this.propData.dataFieldUrl ? this.propData.dataFieldUrl : 'jumpUrl'],this.propData.jumpType)
            }
        },
        makeParamsData(data) {
            let result = {};
            if ( this.propData.paramsMakeFunction && this.propData.paramsMakeFunction.length && window[this.propData.paramsMakeFunction[0].name] ) {
                result = window[this.propData.paramsMakeFunction[0].name].call(this, {
                                        ...data,
                                        ...this.propData.paramsMakeFunction[0].param,
                                        moduleObject: this.moduleObject,
                                    });
                console.log('自定义参数函数',result)
                return result
            }
            return data
        },
        initData() {
            var params = this.commonParam();
            //接收其他组件联动参数
            if ( this.propData.linkageParamList && this.propData.linkageParamList.length > 0 ) {
                this.propData.linkageParamList.forEach((lpitem) => {
                if (Object.keys(lpitem).length > 0) {
                    if (lpitem.msgKey && this.conditionObject[lpitem.msgKey]) {
                        if (lpitem.paramFun && lpitem.paramFun.length > 0) {
                            //有函数
                            try {
                                params[lpitem.paramKey || lpitem.msgKey] =
                                    window[lpitem.paramFun[0].name] &&
                                    window[lpitem.paramFun[0].name].call(this, {
                                    ...params,
                                    ...lpitem.paramFun[0].param,
                                    moduleObject: this.moduleObject,
                                    paramValue:this.conditionObject[lpitem.msgKey]
                                    });
                            } catch (error) {
                                params[lpitem.paramKey || lpitem.msgKey] =
                                    typeof this.conditionObject[lpitem.msgKey] == "object"
                                    ? JSON.stringify(this.conditionObject[lpitem.msgKey])
                                    : this.conditionObject[lpitem.msgKey];
                            }
                        } else {
                            params[lpitem.paramKey || lpitem.msgKey] = typeof this.conditionObject[lpitem.msgKey] == "object"
                                ? JSON.stringify(this.conditionObject[lpitem.msgKey])
                                : this.conditionObject[lpitem.msgKey];
                        }
                    }
                }
                });
            }
            params = this.makeParamsData(params)
            let newParam = { ...params };
            let that = this;
            console.log('newParam',newParam)
            if ( this.propData.dataSource && this.propData.dataSource.length ) {
                IDM.datasource.request(this.propData.dataSource[0].id,{
                    moduleObject:this.moduleObject,
                    param:{
                        ...newParam
                    }
                },function(res){
                    console.log('grid组件获取数据++++++++',res)
                    if ( res && res.length ) {
                        that.data_list = res;
                        that.changeLines()
                    }
                },function(error){
                    //这里是请求失败的返回结果
                    console.log('error',error)
                })
            } else {
                that.data_list = getGridData()
                that.changeLines()
            }
        },
        changeLines() {
            if ( !this.propData.showRows ) {
                return
            }
            if ( this.data_list && (this.data_list.length > this.propData.showRows * this.propData.showColumn) ) {
                this.data_list.splice(this.propData.showRows * this.propData.showColumn)
                console.log('splice',this.data_list)
            }
        },
        
        /**
         * 提供父级组件调用的刷新prop数据组件
         */
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            this.convertAttrToStyleObject();
            this.initData()
        },
        convertThemeListAttrToStyleObject() {
            const themeList = this.propData.themeList;
            if ( (!themeList) || !themeList.length ) {
                return
            }
            const themeNamePrefix = IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix ? IDM.setting.applications.themeNamePrefix : "idm-theme-";
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i];
                
                if(item.key!=IDM.theme.getCurrentThemeInfo()){
                    //此处比对是不渲染输出不用的样式，如果页面会刷新就可以把此处放开
                    continue;
                }
                let borderObject = {
                    'border-color': item.mainColor ? item.mainColor.hex8 : "",
                }
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ant-select-selection:hover", borderObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active", borderObject );
            }
        },
        /** * 把属性转换成样式对象 */
        convertAttrToStyleObjectLeft() {
            var styleObject = {};
            var styleObjectImg = {};
            var styleObjectLine = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthLeft":
                            styleObject['width'] = element;
                            break;
                        case "heightLeft":
                            styleObject['height'] = element;
                            break;
                        case "boxLeft":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "widthLeftImg":
                            styleObjectImg['width'] = element;
                            break;
                        case "heightLeftImg":
                            styleObjectImg['height'] = element;
                            break; 
                        case "boxLeftImg":
                            IDM.style.setBoxStyle(styleObjectImg,element)
                            break;
                        case "heightLeftLine":
                            styleObjectLine['height'] = element;
                            break; 
                        case "bgColorLine":
                            if (element && element.hex8) {
                                styleObjectLine["background-color"] = element.hex8;
                            }
                            break; 
                        case "boxLeftLine":
                            IDM.style.setBoxStyle(styleObjectLine,element)
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list .grid_list_left', styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list .grid_list_left img', styleObjectImg);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list .grid_list_left .line', styleObjectLine);
        },
        convertAttrToStyleObjectRight() {
            var styleObject = {};
            var styleObjectName = {};
            var styleObjectNameBox = {};

            var styleObjectTitle = {};
            var styleObjectIntegral = {};
            var styleObjectCare = {};
            var styleObjectCancel = {};



            var styleObjectUnit = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthRight":
                            styleObject['width'] = element;
                            break;
                        case "heightRight":
                            styleObject['height'] = element;
                            break;
                        case "boxRight":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "fontName":
                            IDM.style.setFontStyle(styleObjectName,element)
                            break;
                        case "boxItemName":
                            IDM.style.setBoxStyle(styleObjectNameBox,element)
                            break;
                        case "fontTitle":
                            IDM.style.setFontStyle(styleObjectTitle,element)
                            break;
                        case "fontIntegral":
                            IDM.style.setFontStyle(styleObjectIntegral,element)
                            break;

                        case "widthCare":
                            styleObjectCare['width'] = element;
                            break;
                        case "heightCare":
                            styleObjectCare['height'] = element;
                            break;
                        case "bgColorCare":
                            if (element && element.hex8) {
                                styleObjectCare["background-color"] = element.hex8;
                            }
                            break;
                        case "fontCare":
                            IDM.style.setFontStyle(styleObjectCare,element)
                            break;
                        case "borderCare":
                            IDM.style.setBorderStyle(styleObjectCare,element)
                            break;
                        case "widthCancel":
                            styleObjectCancel['width'] = element;
                            break;
                        case "heightCancel":
                            styleObjectCancel['height'] = element;
                            break;
                        case "bgColorCancel":
                            if (element && element.hex8) {
                                styleObjectCancel["background-color"] = element.hex8;
                            }
                            break;
                        case "fontCancel":
                            IDM.style.setFontStyle(styleObjectCancel,element)
                            break;
                        case "borderCancel":
                            IDM.style.setBorderStyle(styleObjectCancel,element)
                            break;
                        
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list .grid_list_right', styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list .grid_list_right .top .name', styleObjectName);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list .grid_list_right .top', styleObjectNameBox);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list .grid_list_right .bottom .title', styleObjectTitle);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list .grid_list_right .bottom .integral', styleObjectIntegral);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list .grid_list_right .top .care', styleObjectCare);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list .grid_list_right .top .cancel', styleObjectCancel);
        },
        convertAttrToStyleObjectItem() {
            var styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthItem":
                            styleObject['width'] = element;
                            break;
                        case "heightItem":
                            styleObject['height'] = element;
                            break;
                        case "bgColorItem":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                                styleObject['background-image'] = 'none !important'
                            }
                            break;
                        case "bgImgUrlItem":
                            styleObject["background-image"] = `url(${window.IDM.url.getWebPath(element)})`;
                            break;
                        case "boxItem":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "borderItem":
                            IDM.style.setBorderStyle(styleObject,element)
                            break;
                        case "boxShadowItem":
                            styleObject["box-shadow"] = element;
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .grid_list', styleObject);
        },
        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectItem()
            this.convertAttrToStyleObjectLeft()
            this.convertAttrToStyleObjectRight()
            var styleObject = {};
            if (this.propData.bgSize && this.propData.bgSize == "custom") {
                styleObject["background-size"] = (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") + " " + (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto")
            } else if (this.propData.bgSize) {
                styleObject["background-size"] = this.propData.bgSize;
            }
            if (this.propData.positionX && this.propData.positionX.inputVal) {
                styleObject["background-position-x"] = this.propData.positionX.inputVal + this.propData.positionX.selectVal;
            }
            if (this.propData.positionY && this.propData.positionY.inputVal) {
                styleObject["background-position-y"] = this.propData.positionY.inputVal + this.propData.positionY.selectVal;
            }
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "width":
                        case "height":
                            styleObject[key] = element;
                            break;
                        case "bgColor":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "box":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "bgImgUrl":
                            styleObject["background-image"] = `url(${window.IDM.url.getWebPath(element)})`;
                            break;
                        case "positionX":
                            //背景横向偏移

                            break;
                        case "positionY":
                            //背景纵向偏移

                            break;
                        case "bgRepeat":
                            //平铺模式
                            styleObject["background-repeat"] = element;
                            break;
                        case "bgAttachment":
                            //背景模式
                            styleObject["background-attachment"] = element;
                            break;
                        case "border":
                            IDM.style.setBorderStyle(styleObject,element)
                            break;
                        case "font":
                            IDM.style.setFontStyle(styleObject,element)
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
        },
        /**
         * 通用的url参数对象
         * 所有地址的url参数转换
         */
        commonParam() {
            let urlObject = IDM.url.queryObject();
            var params = {
                pageId:
                    window.IDM.broadcast && window.IDM.broadcast.pageModule
                        ? window.IDM.broadcast.pageModule.id
                        : "",
                urlData: JSON.stringify(urlObject),
            };
            return params;
        },
        
        /** * 通用的获取表达式匹配后的结果 */
        getExpressData(dataName, dataFiled, resultData) {
            //给defaultValue设置dataFiled的值
            var _defaultVal = undefined;
            if (dataFiled) {
                var filedExp = dataFiled;
                filedExp =
                    dataName +
                    (filedExp.startsWiths("[") ? "" : ".") +
                    filedExp;
                var dataObject = { IDM: window.IDM };
                dataObject[dataName] = resultData;
                _defaultVal = window.IDM.express.replace.call(
                    this,
                    "@[" + filedExp + "]",
                    dataObject
                );
            }
            //对结果进行再次函数自定义
            if (this.propData.customFunction && this.propData.customFunction.length > 0) {
                var params = this.commonParam();
                var resValue = "";
                try {
                    resValue = window[this.propData.customFunction[0].name] && window[this.propData.customFunction[0].name].call(this, {
                        ...params,
                        ...this.propData.customFunction[0].param,
                        moduleObject: this.moduleObject,
                        expressData: _defaultVal, interfaceData: resultData
                    });
                } catch (error) {
                }
                _defaultVal = resValue;
            }

            return _defaultVal;
        },
        /**
         * 组件通信：接收消息的方法
         * @param {
         *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
         * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
         *  message:{发送的时候传输的消息对象数据}
         *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
         *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
         * } object 
         */
        onReInitDataMsgKey(conditionObject,messageKey){
            this.conditionObject[messageKey] = conditionObject;
            this.initData()
        },
        receiveBroadcastMessage(object) {
            console.log("组件收到消息", object)
            if( object.type && object.type=="linkageReload" ){
                this.initData();
            }
            if(object.type&&object.type=="linkageDemand"){
                if(object.messageKey){
                    this.onReInitDataMsgKey(object.message,object.messageKey);
                }
            }
        },
        /**
         * 组件通信：发送消息的方法
         * @param {
         *  type:"自己定义的，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
         * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）",
         *  message:{实际的消息对象},
         *  rangeModule:"为空发送给全部，根据配置的属性中设定的值（值的内容是组件的packageid数组），不取子表的，比如直接 this.$root.propData.compositeAttr["attrKey"]（注意attrKey是属性中定义的bindKey）,这里的格式为：['1','2']"",
         *  className:"指定的组件类型，比如只给待办组件发送，然后再去过滤上面的值"
         *  globalSend:如果为true则全站发送消息，注意全站rangeModule是无效的，只有className才有效，默认为false
         * } object 
         */
        sendBroadcastMessage(object) {
            window.IDM.broadcast && window.IDM.broadcast.send(object);
        },
        /**
         * 交互功能：设置组件的上下文内容值
         * @param {
         *  type:"定义的类型，已知类型：pageCommonInterface（页面统一接口返回值）、"
         *  key:"数据key标识，页面每个接口设置的数据集名称，方便识别获取自己需要的数据"
         *  data:"数据集，内容为：字符串 or 数组 or 对象"
         * }
         */
        setContextValue(object) {
            console.log("统一接口设置的值", object);
            if (object.type != "pageCommonInterface") {
                return;
            }
            //这里使用的是子表，所以要循环匹配所有子表的属性然后再去设置修改默认值
            if (object.key == this.propData.dataName) {
                // this.propData.fontContent = this.getExpressData(this.propData.dataName,this.propData.dataFiled,object.data);
                this.$set(this.propData, "fontContent", this.getExpressData(this.propData.dataName, this.propData.dataFiled, object.data));
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.IGrid_app{
    padding: 20px 0;
    overflow-y: auto;
    .grid_list{
        width: 100%;
        position: relative;
        padding: 29px 28px 29px 28px;
        color: white;
        border-radius: 5px;
        box-shadow: 0px 3px 6px 0px rgba(174,174,174,0.5);
        .grid_list_left{
            margin-right: 15px;
            img{
                width: 110px;
                height: 110px;
            }
        }
        .grid_list_right{
            width: 100%;
            .top{
                width: 100%;
                margin-bottom: 15px;
                .name{
                    font-size: 18px;
                    color: #333333;
                    letter-spacing: 0;
                    line-height: 24px;
                    font-weight: 500;
                }
                .operator{
                    span{
                        width: 86px;
                        height: 34px;
                        display: inline-block;
                        line-height: 34px;
                        text-align: center;
                        font-size: 16px;
                        border-radius: 17px;
                        cursor: pointer;
                    }
                    .cancel{
                        color: #0091FF;
                        background: #FFFFFF;
                        border: 1px solid #0091FF;
                    }
                    .care{
                        color: #FFFFFF;
                        background-image: linear-gradient(180deg, #45C8F4 0%, #5D93FB 100%);
                    }
                }
            }
            .bottom{
                width: 100%;
                font-size: 16px;
                color: #666666;
                letter-spacing: 0;
                line-height: 24px;
                font-weight: 400;
            }
        }
    }
}
</style>
<style lang="scss">
.van-grid-item__content{
    padding: 0 !important;
    background-color: rgba(0,0,0,0) !important;
}
.van-grid-item:last-child{
    // padding-right: 0 !important;
}
</style>
