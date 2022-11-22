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
    class="i-search-bar-outer"
  >
    <div class="i-search-bar-main">
      <div class="i-search-bar-box">
        <span class="i-search-bar-box-icon"
          ><svg-icon icon-class="search"
        /></span>
        <input
          class="i-search-bar-box-ipt"
          type="text"
          :placeholder="placeholder"
          v-model="searchText"
        />
        <div class="i-search-bar-box-btn" @click="searchHanlder">搜索</div>
      </div>
      <div class="i-search-bar-hotwords" v-if="propData.showHotWords">
        <span
          v-for="(word, w) in hotWordList"
          :key="w"
          @click="hotWordClick(word)"
          >{{ word.title }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
const hotMock = [
  {
    title: "会议记录",
    id: "1001",
  },
  {
    title: "工作计划",
    id: "1002",
  },
  {
    title: "求职简历",
    id: "1003",
  },
  {
    title: "劳动合同",
    id: "1004",
  },
];

// const templateMock = {
//   suggest:[
//     {
//       id:'1001',
//       title:'简约商务风工作总结汇报',
//       img:"",
//       id:'1002',
//       title:'简约商务风工作总结汇报',
//       img:"",
//       id:'1003',
//       title:'简约商务风工作总结汇报',
//       img:"",
//       id:'1004',
//       title:'简约商务风工作总结汇报',
//       img:"",
//       id:'1005',
//       title:'简约商务风工作总结汇报',
//       img:""
//     }
//   ]
// }
export default {
  name: "ISearchBar",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        hotWordsLoop: true,
        showHotWords: true,
      },
      hotWordList: [],
      placeholder: "请搜索",
      placeholderKey: 0,
      timer: null,
      dataSourceRefresh: [],
      searchRefresh: [],
      searchText: "",
      activeTab:''
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
     * 搜索
     */
    searchHanlder() {
      if (this.propData.hotWordsLoop && !this.searchText)
        this.searchText = this.placeholder;

      this.requestTemplate();

      // 搜索自定义函数
      const func = this.propData.searchFunction;
      func &&
        window[func[0].name] &&
        window[func[0].name].call(this, {
          ...this.commonParam(),
          customParam: func[0].param,
          _this: this,
          searchText: this.searchText,
        });
    },
    /**
     * 热词点击
     */
    hotWordClick(item) {
      this.searchText = item.title;
      this.searchHanlder();
    },
    /**
     * 请求模板数据
     */
    requestTemplate() {
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        // setTimeout(() => {
        //   this.hotWordList = hotMock;
        //   this.hotWordsLoop();
        // }, 500);
      } else if (this.moduleObject.env === "production") {
        let dataSource =
          this.propData.searchDataSource && this.propData.searchDataSource[0];
        if (!dataSource) {
          return;
        }

        const params = {
          text:this.searchText,
          tabId:this.activeTab
        }
        IDM.datasource.request(
          dataSource.id,
          {
            moduleObject: this.moduleObject,
            param: params,
          },
          (res) => {
            console.log(res, "模板接口返回结果");
            res && this.linkageHandler(res);
          },
          (res) => {
            console.log(res, "请求失败");
          }
        );
      }
    },
    /**
     * 联动组件
     */
    linkageHandler(res) {
      if (
        this.propData.linkageComponent &&
        this.propData.linkageComponent.length > 0
      ) {
        const rangeModule = [];
        this.propData.linkageComponent.forEach((item) => {
          rangeModule.push(item.moduleId);
        });
        IDM.broadcast.send({
          type: "sendTemplateData",
          message: res,
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
    initPropData() {
      // 滚动热词
      if (this.propData.hotWordsLoop) {
        this.hotWordsLoop();
      } else {
        clearInterval(this.timer);
        this.placeholder = "请选择";
      }

      // 数据源解析
      if (this.propData.dataSource && this.propData.dataSource[0]) {
        this.dataSourceRefresh = [];
        const refreshJson = this.propData.dataSource[0].refreshJson;
        refreshJson &&
          JSON.parse(refreshJson).forEach((item) =>
            this.dataSourceRefresh.push(item.key)
          );
      }
      if (this.propData.searchDataSource && this.propData.searchDataSource[0]) {
        this.searchRefresh = [];
        const refreshJson = this.propData.searchDataSource[0].refreshJson;
        refreshJson &&
          JSON.parse(refreshJson).forEach((item) =>
            this.searchRefresh.push(item.key)
          );
      }
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      let styleObject = {},
        boxStyleObject = {},
        innerStyleObject = {},
        inputStyleObject = {},
        btnStyleObject = {},
        hotWordStyleObject = {};

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
            case "innerWidth":
              boxStyleObject["width"] = element;
              break;
            case "innerHeight":
              boxStyleObject["height"] = element;
              break;
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] = element.hex8;
              }
              break;
            case "btnColor":
              if (element && element.hex8) {
                btnStyleObject["background-color"] =
                  element.hex8 + "!important";
              }
              break;
            case "innerBgColor":
              if (element && element.hex8) {
                innerStyleObject["background-color"] = element.hex8;
                inputStyleObject["background-color"] = element.hex8;
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
            case "innerBox":
              if (element.marginTopVal) {
                innerStyleObject["margin-top"] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                innerStyleObject["margin-right"] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                innerStyleObject[
                  "margin-bottom"
                ] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                innerStyleObject["margin-left"] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                innerStyleObject["padding-top"] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                innerStyleObject[
                  "padding-right"
                ] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                innerStyleObject[
                  "padding-bottom"
                ] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                innerStyleObject["padding-left"] = `${element.paddingLeftVal}`;
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
            case "innerBorder":
              if (element.border.top.width > 0) {
                innerStyleObject["border-top-width"] =
                  element.border.top.width + element.border.top.widthUnit;
                innerStyleObject["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  innerStyleObject["border-top-color"] =
                    element.border.top.colors.hex8 + "!important";
                }
              }
              if (element.border.right.width > 0) {
                innerStyleObject["border-right-width"] =
                  element.border.right.width + element.border.right.widthUnit;
                innerStyleObject["border-right-style"] =
                  element.border.right.style;
                if (element.border.right.colors.hex8) {
                  innerStyleObject["border-right-color"] =
                    element.border.right.colors.hex8 + "!important";
                }
              }
              if (element.border.bottom.width > 0) {
                innerStyleObject["border-bottom-width"] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                innerStyleObject["border-bottom-style"] =
                  element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  innerStyleObject["border-bottom-color"] =
                    element.border.bottom.colors.hex8 + "!important";
                }
              }
              if (element.border.left.width > 0) {
                innerStyleObject["border-left-width"] =
                  element.border.left.width + element.border.left.widthUnit;
                innerStyleObject["border-left-style"] =
                  element.border.left.style;
                if (element.border.left.colors.hex8) {
                  innerStyleObject["border-left-color"] =
                    element.border.left.colors.hex8 + "!important";
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
              innerStyleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                innerStyleObject["color"] = element.fontColors.hex8;
              }
              innerStyleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              innerStyleObject["font-style"] = element.fontStyle;
              innerStyleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              innerStyleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              innerStyleObject["text-align"] = element.fontTextAlign;
              innerStyleObject["text-decoration"] = element.fontDecoration;
              break;
            case "hotWordFont":
              hotWordStyleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                hotWordStyleObject["color"] = element.fontColors.hex8;
              }
              hotWordStyleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              hotWordStyleObject["font-style"] = element.fontStyle;
              hotWordStyleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              hotWordStyleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              hotWordStyleObject["text-align"] = element.fontTextAlign;
              hotWordStyleObject["text-decoration"] = element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .i-search-bar-main",
        boxStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .i-search-bar-main .i-search-bar-box",
        innerStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-search-bar-main .i-search-bar-box .i-search-bar-box-ipt",
        inputStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-search-bar-main .i-search-bar-box .i-search-bar-box-btn",
        btnStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-search-bar-main .i-search-bar-hotwords span",
        hotWordStyleObject
      );

      this.propData.showHotWords && this.initData();
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
          this.hotWordList = hotMock;
          this.propData.hotWordsLoop && this.hotWordsLoop();
        }, 500);
      } else if (this.moduleObject.env === "production") {
        let dataSource =
          this.propData.dataSource && this.propData.dataSource[0];
        if (!dataSource) {
          return;
        }
        const params = {
          tabId:this.activeTab
        }
        IDM.datasource.request(
          dataSource.id,
          {
            moduleObject: this.moduleObject,
            param:params
          },
          (res) => {
            console.log(res, "热词接口返回结果");
            if (res) {
              this.hotWordList = res;
              this.propData.hotWordsLoop && this.hotWordsLoop();
            }
          },
          (res) => {
            console.log(res, "请求失败");
          }
        );
      }
    },
    /**
     * 热词循环定时器
     */
    hotWordsLoop() {
      clearInterval(this.timer);
      this.timer = null;
      clearInterval();
      if (this.hotWordList.length > 0) {
        this.placeholder = this.hotWordList[this.placeholderKey].title;
        this.timer = setInterval(() => {
          if (this.hotWordList.length - 1 <= this.placeholderKey) {
            this.placeholderKey = 0;
          } else {
            this.placeholderKey++;
          }
          this.placeholder = this.hotWordList[this.placeholderKey].title;
        }, 3000);
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
      console.log("搜索框组件收到消息", messageObject);
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
                this.propData.showHotWords && this.initData();
              }
              if (
                arr.includes(messageData.badgeType) ||
                this.searchRefresh.includes(messageData.badgeType)
              ) {
                this.requestTemplate();
              }
            }
          }
          break;
        case "linkageReload":
          this.propDataWatchHandle();
          this.requestTemplate();
          break;
        case "sendActiveTab":
          this.activeTab =
            messageObject.message && messageObject.message.activeKey;
          console.log(this.activeTab, "当前页签标识");
          this.requestTemplate();
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
            " .i-search-bar-main .i-search-bar-box",
          {
            "border-color": item.mainColor
              ? IDM.hex8ToRgbaString(item.mainColor.hex8)
              : "",
          }
        );

        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .i-search-bar-main .i-search-bar-box .i-search-bar-box-btn",
          {
            background: item.mainColor
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
.i-search-bar-outer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .i-search-bar-main {
    width: 470px;
    color: #000;

    .i-search-bar-box {
      height: 44px;
      line-height: 44px;
      background: #ffffff;
      border: 2px solid rgba(0, 145, 255, 1);
      border-radius: 23px;
      display: flex;
      align-items: center;

      .i-search-bar-box-icon {
        width: 40px;
        text-align: center;
        font-size: 18px;
        color: currentColor;
      }

      .i-search-bar-box-ipt {
        height: 100%;
        flex: 1;
        border: none;
        outline: none;
        color: currentColor;

        &::placeholder {
          color: currentColor;
          opacity: 0.4;
        }
      }
      .i-search-bar-box-btn {
        height: 38px;
        width: 70px;
        line-height: 38px;
        margin-right: 1px;
        text-align: center;
        color: #ffffff;
        background: #0091ff;
        border-radius: 20px;
        cursor: pointer;
      }
    }

    .i-search-bar-hotwords {
      padding-top: 16px;
      padding: 0 70px 0 40px;
      display: flex;
      justify-content: space-around;

      span {
        cursor: pointer;
        color: #666666;
      }
    }
  }
}
</style>
