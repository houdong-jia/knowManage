<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    class="i-common-tab-outer"
  >
    <knowmanage-a-tabs :size="propData.size"
      :type="propData.type || 'line'"
      :tabBarGutter="propData.tabBarGutter == 0 ? 0 : propData.tabBarGutter || null">
      <knowmanage-a-tab-pane v-for="tab in tabList" :key="tab.id">
        <span slot="tab" class="i-common-tab-icon" :class="{ 'ant-tabs-tab-divider': propData.tabShowDivider }">
          <img v-if="tab.icon" :src="IDM.url.getWebPath(tab.icon)" />
          <img v-else src="../assets/default_tab.png" />
          {{ tab.title }}
        </span>
      </knowmanage-a-tab-pane>
    </knowmanage-a-tabs>
    <!-- <div class="idm-more-frame-drag-ontainer">
      <div
        class="drag_container"
        idm-ctrl-inner
        :idm-ctrl-id="moduleObject.id"
        idm-container-index="1"
      ></div>
    </div> -->
  </div>
</template>

<script>
const mock = [
  {
    title: "word文档",
    icon: "",
    id: "1001",
  },
  {
    title: "excel表格",
    icon: "",
    id: "1002",
  },
  {
    title: "xx文档",
    icon: "",
    id: "1003",
  },
];
export default {
  name: "ICommonTab",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        size: "large",
        animated: true,
        type: "line",
        tabBarGutter: 20,
        tabShowDivider:false,
        dividerHeightNumber: 100,
        dividerTopNumber: 0,
        dividerRightNumber: -16
      },
      tabList: [],
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
  },
  mounted() {},
  destroyed() {},
  methods: {
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      let styleObject = {},
        tabStyleObject = {},
        tabActiveStyleObject = {},
        iconStyleObject = {};

      if (this.propData.bgSize && this.propData.bgSize == "custom") {
        styleObject["background-size"] =
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal +
              this.propData.bgSizeWidth.selectVal
            : "auto") +
          " " +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal +
              this.propData.bgSizeHeight.selectVal
            : "auto");
      } else if (this.propData.bgSize) {
        styleObject["background-size"] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject["background-position-x"] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject["background-position-y"] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
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
              if (element.marginTopVal) {
                styleObject["margin-top"] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                styleObject["margin-right"] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                styleObject["margin-bottom"] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                styleObject["margin-left"] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                styleObject["padding-top"] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                styleObject["padding-right"] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                styleObject["padding-bottom"] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                styleObject["padding-left"] = `${element.paddingLeftVal}`;
              }
              break;
            case "bgImgUrl":
              styleObject[
                "background-image"
              ] = `url(${window.IDM.url.getWebPath(element)})`;
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
              if (element.border.top.width > 0) {
                styleObject["border-top-width"] =
                  element.border.top.width + element.border.top.widthUnit;
                styleObject["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  styleObject["border-top-color"] =
                    element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                styleObject["border-right-width"] =
                  element.border.right.width + element.border.right.widthUnit;
                styleObject["border-right-style"] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  styleObject["border-right-color"] =
                    element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                styleObject["border-bottom-width"] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                styleObject["border-bottom-style"] =
                  element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  styleObject["border-bottom-color"] =
                    element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                styleObject["border-left-width"] =
                  element.border.left.width + element.border.left.widthUnit;
                styleObject["border-left-style"] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  styleObject["border-left-color"] =
                    element.border.left.colors.hex8;
                }
              }

              styleObject["border-top-left-radius"] =
                element.radius.leftTop.radius +
                element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"] =
                element.radius.rightTop.radius +
                element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"] =
                element.radius.leftBottom.radius +
                element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"] =
                element.radius.rightBottom.radius +
                element.radius.rightBottom.radiusUnit;
              break;
            case "font":
              tabStyleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                tabStyleObject["color"] = element.fontColors.hex8;
              }
              tabStyleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              tabStyleObject["font-style"] = element.fontStyle;
              tabStyleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              tabStyleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              tabStyleObject["text-align"] = element.fontTextAlign;
              tabStyleObject["text-decoration"] = element.fontDecoration;
              break;
            case "activeFont":
              tabActiveStyleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                tabActiveStyleObject["color"] = element.fontColors.hex8;
              }
              tabActiveStyleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              tabActiveStyleObject["font-style"] = element.fontStyle;
              tabActiveStyleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              tabActiveStyleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              tabActiveStyleObject["text-align"] = element.fontTextAlign;
              tabActiveStyleObject["text-decoration"] = element.fontDecoration;
              break;
            case "iconWidth":
              iconStyleObject['width'] = element;
              break;
            case "iconHeight":
              iconStyleObject['height'] = element;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .ant-tabs-nav .ant-tabs-tab",
        tabStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active",
        tabActiveStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-common-tab-icon img",
        iconStyleObject
      );

      //分割线
      if (this.propData.tabShowDivider) {
        styleObject = {};
        if (this.propData.dividerHeightNumber + "") {
          styleObject["height"] = this.propData.dividerHeightNumber + "%";
        }
        if (this.propData.dividerTopNumber + "") {
          styleObject["top"] = this.propData.dividerTopNumber + "%";
        }
        if (this.propData.dividerRightNumber + "") {
          styleObject["right"] = this.propData.dividerRightNumber + "px";
        }
        if (this.propData.dividerBgColor && this.propData.dividerBgColor.hex8) {
          styleObject["background-color"] = this.propData.dividerBgColor.hex8;
        }
        window.IDM.setStyleToPageHead(
          this.moduleObject.id + " .ant-tabs-tab-divider::before",
          styleObject
        );
      }

      //ant-tabs-tab  以tab为单位的
      if (
        this.propData.tabLeftPadding &&
        this.propData.tabLeftPadding.inputVal + "" &&
        this.propData.tabLeftPadding.selectVal
      ) {
        styleObject["padding-left"] =
          this.propData.tabLeftPadding.inputVal +
          this.propData.tabLeftPadding.selectVal;
      }
      if (
        this.propData.tabRightPadding &&
        this.propData.tabRightPadding.inputVal + "" &&
        this.propData.tabRightPadding.selectVal
      ) {
        styleObject["padding-right"] =
          this.propData.tabRightPadding.inputVal +
          this.propData.tabRightPadding.selectVal;
      }
      if (
        this.propData.tabTopPadding &&
        this.propData.tabTopPadding.inputVal + "" &&
        this.propData.tabTopPadding.selectVal
      ) {
        styleObject["padding-top"] =
          this.propData.tabTopPadding.inputVal +
          this.propData.tabTopPadding.selectVal;
      }
      if (
        this.propData.tabBottomPadding &&
        this.propData.tabBottomPadding.inputVal + "" &&
        this.propData.tabBottomPadding.selectVal
      ) {
        styleObject["padding-bottom"] =
          this.propData.tabBottomPadding.inputVal +
          this.propData.tabBottomPadding.selectVal;
      }
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .ant-tabs-nav .ant-tabs-tab",
        styleObject
      );


      this.initData();
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
    /**
     * 加载动态数据
     */
    initData() {
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        setTimeout(() => {
          this.tabList = mock;
        }, 500);
      } else if (this.moduleObject.env === "production") {
        let dataSource =
          this.propData.dataSource && this.propData.dataSource[0];
        if (!dataSource) {
          return;
        }
        IDM.datasource.request(
          dataSource.id,
          {
            moduleObject: this.moduleObject,
          },
          (res) => {
            console.log(res, "接口返回结果");
          },
          (res) => {
            console.log(res, "请求失败");
          }
        );
      }
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if (dataFiled) {
        var filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths("[") ? "" : ".") + filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
      }
      //对结果进行再次函数自定义
      if (
        this.propData.customFunction &&
        this.propData.customFunction.length > 0
      ) {
        var params = this.commonParam();
        var resValue = "";
        try {
          resValue =
            window[this.propData.customFunction[0].name] &&
            window[this.propData.customFunction[0].name].call(this, {
              ...params,
              ...this.propData.customFunction[0].param,
              moduleObject: this.moduleObject,
              expressData: _defaultVal,
              interfaceData: resultData,
            });
        } catch (error) {}
        _defaultVal = resValue;
      }

      return _defaultVal;
    },
    showThisModuleHandle() {
      this.propData.defaultStatus = "default";
    },
    hideThisModuleHandle() {
      this.propData.defaultStatus = "hidden";
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
    receiveBroadcastMessage(object) {
      console.log("组件收到消息", object);
      if (object.type && object.type == "linkageShowModule") {
        this.showThisModuleHandle();
      } else if (object.type && object.type == "linkageHideModule") {
        this.hideThisModuleHandle();
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
        this.$set(
          this.propData,
          "fontContent",
          this.getExpressData(
            this.propData.dataName,
            this.propData.dataFiled,
            object.data
          )
        );
      }
    },
  },
};
</script>
<style scoped lang="scss">
.i-common-tab-outer {
  width: 100%;
  height: 100%;
  padding: 0 30px 20px 30px;

  ::v-deep .ant-tabs {
    .ant-tabs-tab {
      color: #666;
      font-size: 14px;

      &.ant-tabs-tab-active {
        color: #333;
        font-size: 16px;
      }
    }

    .ant-tabs-ink-bar {
      height: 3px;
    }

    .ant-tabs-tab-divider {
      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0px;
        width: 1px;
        height: 50%;
        background-color: #e8e8e8;
        pointer-events: none;
      }
    }

    .ant-tabs-nav .ant-tabs-tab:last-child .ant-tabs-tab-divider {
      &::before {
        display: none;
      }
    }
  }

  .i-common-tab-icon img {
    width: 16px;
  }
}
</style>
