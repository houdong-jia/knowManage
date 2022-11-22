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
    <knowmanage-a-tabs
      :size="propData.size"
      :type="propData.type || 'line'"
      :tabBarGutter="
        propData.tabBarGutter == 0 ? 0 : propData.tabBarGutter || null
      "
      @change="changeHandler"
    >
      <knowmanage-a-tab-pane v-for="tab in tabList" :key="tab.id">
        <span
          slot="tab"
          class="i-common-tab-icon"
          :class="{ 'ant-tabs-tab-divider': propData.tabShowDivider }"
        >
          <img v-if="tab.icon" :src="IDM.url.getWebPath(tab.icon)" />
          <img v-else src="../assets/default_tab.png" />
          {{ tab.title }}
        </span>
      </knowmanage-a-tab-pane>
    </knowmanage-a-tabs>
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
        tabBarGutter: 40,
        tabShowDivider: false,
        dividerHeightNumber: 100,
        dividerTopNumber: 0,
        dividerRightNumber: -16,
        tabTopPadding: {
          inputVal: 16,
          selectVal: "px",
        },
        tabRightPadding: {
          inputVal: 0,
          selectVal: "px",
        },
        tabBottomPadding: {
          inputVal: 16,
          selectVal: "px",
        },
        tabLeftPadding: {
          inputVal: 0,
          selectVal: "px",
        },
      },
      tabList: [],
      // 数据源刷新key
      dataSourceRefresh: []
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertThemeListAttrToStyleObject();
    this.convertAttrToStyleObject();
    this.initPropData();
  },
  mounted() {},
  destroyed() {},
  methods: {
    /**
     * 页签切换时的回调函数
     */
    changeHandler(activeKey) {
      this.linkageHandler(activeKey);

      // 切换自定义函数
      const func = this.propData.clickFunction;
      func &&
        window[func[0].name] &&
        window[func[0].name].call(this, {
          ...this.commonParam(),
          customParam: func[0].param,
          _this: this,
          activeKey,
        });
    },
    /**
     * 联动组件
     */
    linkageHandler(activeKey) {
      if (
        this.propData.linkageComponent &&
        this.propData.linkageComponent.length > 0
      ) {
        const rangeModule = [];
        this.propData.linkageComponent.forEach((item) => {
          rangeModule.push(item.moduleId);
        });
        console.log(rangeModule,"发送")
        IDM.broadcast.send({
          type: "sendActiveTab",
          message: {
            activeKey,
          },
          rangeModule,
        });
      }
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertThemeListAttrToStyleObject();
      this.convertAttrToStyleObject();
      this.initPropData();
    },
    /**
     * 初始化变量
     */
    initPropData(){
      // 数据源解析
      if (
        this.propData.dataSource &&
        this.propData.dataSource[0]
      ) {
        this.dataSourceRefresh = [];
        const refreshJson = this.propData.dataSource[0].refreshJson;
        refreshJson &&
          JSON.parse(refreshJson).forEach((item) =>
            this.dataSourceRefresh.push(item.key)
          );
      }
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
              iconStyleObject["width"] = element;
              break;
            case "iconHeight":
              iconStyleObject["height"] = element;
              break;
            case "tabLeftPadding":
              tabStyleObject["padding-left"] =
                element.inputVal + element.selectVal;
              break;
            case "tabTopPadding":
              tabStyleObject["padding-top"] =
                element.inputVal + element.selectVal;
              break;
            case "tabRightPadding":
              tabStyleObject["padding-right"] =
                element.inputVal + element.selectVal;
              break;
            case "tabBottomPadding":
              tabStyleObject["padding-bottom"] =
                element.inputVal + element.selectVal;
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
        this.moduleObject.id + " .i-common-tab-icon img",
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
          if (this.tabList[0]) this.linkageHandler(this.tabList[0]);
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
            this.tabList = res;
            if (this.tabList && this.tabList[0])
              this.linkageHandler(this.tabList[0]);
          },
          (res) => {
            console.log(res, "请求失败");
          }
        );
      }
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
    receiveBroadcastMessage(messageObject) {
      console.log("通用页签组件收到消息", messageObject);
      switch (messageObject.type) {
        case "websocket":
          if (this.propData.messageRefreshKey && messageObject.message) {
            // 配置刷新key刷新
            const messageData =
              (typeof messageObject.message === "string" &&
                JSON.parse(messageObject.message)) ||
              messageObject.message;
            const arr = Array.isArray(this.propData.messageRefreshKey)
              ? this.propData.messageRefreshKey
              : [this.propData.messageRefreshKey];
            if (messageData.badgeType) {
              if (
                arr.includes(messageData.badgeType) ||
                this.dataSourceRefresh.includes(messageData.badgeType)
              ) {
                this.initData();
              }
            }
          }
          break;
        case "linkageReload":
          this.propDataWatchHandle();
          break;
      }
    },
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject() {
      const themeList = this.propData.themeList;
      if (!themeList) {
        return;
      }
      const themeNamePrefix =
        IDM.setting &&
        IDM.setting.applications &&
        IDM.setting.applications.themeNamePrefix
          ? IDM.setting.applications.themeNamePrefix
          : "idm-theme-";
      for (var i = 0; i < themeList.length; i++) {
        var item = themeList[i];

        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .ant-tabs-ink-bar",
          {
            "background-color": item.mainColor
              ? IDM.hex8ToRgbaString(item.mainColor.hex8)
              : "",
          }
        );
      }
    },
  },
};
</script>
<style scoped lang="scss">
.i-common-tab-outer {
  width: 100%;

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

    .ant-tabs-bar {
      margin-bottom: 0;
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

    &.ant-tabs-card {
      .ant-tabs-card-bar .ant-tabs-nav-container {
        height: auto;

        .ant-tabs-tab {
          height: auto;
          line-height: initial;
        }
      }
    }
  }

  .i-common-tab-icon img {
    width: 16px;
    vertical-align: text-bottom;
  }
}
</style>
