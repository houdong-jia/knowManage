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
    class="i-directory-menu-outer"
    ref="module_ref"
    :style="{ height: moduleHeight + 'px' }"
  >
    <div class="i-directory-menu-tab">
      <div
        class="i-directory-menu-tab-item"
        v-for="(tab, t) in propData.tabsList"
        :key="t"
        :class="{ active: activeTab === tab.value }"
        @click="tabClick(tab)"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="i-directory-menu-container" :class="{ thin: isThin }">
      <div
        class="i-directory-menu-container-item"
        v-for="(menu, m) in menuList"
        :key="m"
        @mousemove="mousemove(menu)"
        @mouseleave="mouseleave()"
        @click="clickHandler(menu)"
      >
        <div class="container-item-left">
          <span class="container-item-left-first">{{ menu.name }}</span>
          <span class="container-item-left-second">
            <span v-for="(second, s) in menu.children" :key="s">{{
              second.name
            }}</span>
          </span>
        </div>
        <div class="container-item-right">
          <svg-icon icon-class="arrowRight" />
        </div>
      </div>
    </div>
    <div
      v-show="showPopup && curMenu.length > 0"
      class="i-directory-menu-popup"
      :style="{ height: moduleHeight - 40 + 'px' }"
      @mousemove="showPopup = true"
      @mouseleave="showPopup = false"
    >
      <span class="menu-popup-item" v-for="(menu, m) in curMenu" :key="m">
        <span class="popup-item-second" @click.stop="clickHandler(menu)">{{ menu.name }}</span>
        <span class="popup-item-third" >
          <span v-for="(third, t) in menu.children" :key="t" @click.stop="clickHandler(third)">{{
            third.name
          }}</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
const mock = [
  {
    name: "一级目录",
    id: "",
    children: [
      {
        name: "二级目录",
        id: "",
        children: [
          {
            name: "三级目录",
            id: "",
          },
          {
            name: "三级目录",
            id: "",
          },
          {
            name: "三级目录",
            id: "",
          },
          {
            name: "三级目录",
            id: "",
          },
          {
            name: "三级目录",
            id: "",
          },
          {
            name: "三级目录",
            id: "",
          },
          {
            name: "三级目录",
            id: "",
          },
          {
            name: "三级目录",
            id: "",
          },
        ],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
    ],
  },
  {
    name: "一级目录",
    id: "",
    children: [
      {
        name: "二级目录",
        id: "",
        children: [
          {
            name: "三级目录",
            id: "",
            children: [],
          },
          {
            name: "三级目录",
            id: "",
            children: [],
          },
        ],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
    ],
  },
  {
    name: "一级目录",
    id: "",
    children: [
      {
        name: "二级目录",
        id: "",
        children: [
          {
            name: "三级目录",
            id: "",
            children: [],
          },
          {
            name: "三级目录",
            id: "",
            children: [],
          },
        ],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
      {
        name: "二级目录",
        id: "",
        children: [],
      },
    ],
  },
  {
    name: "一级目录",
    id: "",
    children: [],
  },
  {
    name: "一级目录",
    id: "",
    children: [],
  },
  {
    name: "一级目录",
    id: "",
    children: [],
  },
];
export default {
  name: "IDirectoryMenu",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        tabsList: [
          {
            value: "unit",
            label: "单位目录",
          },
          {
            value: "department",
            label: "部门目录",
          },
        ],
        moduleHeight: 350,
      },
      moduleHeight: 0,
      activeTab: "",
      menuList: [],
      maxMenu: 0,
      isThin: false,
      curMenu: [],
      showPopup: false,
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertThemeListAttrToStyleObject();
    this.convertAttrToStyleObject();
    this.initPropData();

    this.$nextTick(() => {
      this.resizeContentWrapperHeight();
    });
  },
  mounted() {},
  destroyed() {},
  methods: {
    clickHandler(item){
      const func = this.propData.clickFunction?.[0];
      if (func) {
        window[func.name] &&
          window[func.name].call(this, {
            item,
            customParam: func.param,
            commonParam: this.commonParam(),
            _this: this,
          });
      }
    },
    tabClick(tab){
      this.activeTab = tab.value;
      this.initData()
    },
    mousemove(item) {
      this.curMenu = item.children;
      this.showPopup = true;
    },
    mouseleave() {
      this.showPopup = false;
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertThemeListAttrToStyleObject();
      this.convertAttrToStyleObject();
      this.initPropData();

      this.$nextTick(() => {
        this.resizeContentWrapperHeight();
      });
    },
    /**
     * 初始化变量
     */
    initPropData() {
      if (this.propData.tabsList[0]) {
        this.activeTab = this.propData.tabsList[0].value;
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

      this.initData();
    },
    /**
     * 根据属性heightType确定是使用固定高度还是自动适应外层的高度
     * 如果使用固定高度则取设置的固定高度
     * 如果使用自适应外层高度则需要外层传过来高度
     * 不管上述使用哪种高度都需要去减去tab的高度外加外层容器的padding、margin和内层列表的margin、padding、注意重叠计算
     * @param {Number} wrapperHeight 为外层容器的实际高度值
     */
    resizeContentWrapperHeight(wrapperHeight) {
      let moduleHeight =
        this.propData.heightType == "adaptive"
          ? $("#" + this.moduleObject.packageid)
              .parents(".fsl-region-element")
              .height()
          : this.propData.moduleHeight;
      if (
        this.propData.heightType == "adaptive" &&
        (wrapperHeight || moduleHeight)
      ) {
        //自适应父级容器
        moduleHeight = wrapperHeight || moduleHeight;

        //如果自适应则要减去上margin和下margin(因为margin、padding百分比都是相对父级宽度，所以要计算出实际的宽度值)
        //父级宽度值未知的，因为组件的宽度是100%显示的
        //所以计算公式为：(当前组件的宽度+左右margin实际数值)/(100-左右margin百分比总和)*100=实际宽度
        let iAttrArray = ["marginLeftVal", "marginRightVal"];
        let marginNumber = 0,
          marginRatio = 0;
        iAttrArray.forEach((item) => {
          if (
            this.propData.box &&
            this.propData.box[item] &&
            this.propData.box[item].indexOf("%") > -1
          ) {
            //用宽度计算出实际的px
            marginRatio += parseFloat(this.propData.box[item].replace("%", ""));
          } else if (this.propData.box && this.propData.box[item]) {
            marginNumber += parseFloat(
              this.propData.box[item].replace("px", "")
            );
          }
        });
        let module_width = this.$refs.module_ref.offsetWidth;
        //实际的100%的宽度
        const module_width_100 =
          ((module_width + marginNumber) / (100 - marginRatio)) * 100;

        let moduleTBMarginNumber = 0;
        iAttrArray = ["marginTopVal", "marginBottomVal"];
        iAttrArray.forEach((item) => {
          if (this.propData.box && this.propData.box[item]) {
            if (this.propData.box[item].indexOf("%") > -1) {
              //用宽度计算出实际的px
              moduleTBMarginNumber =
                moduleTBMarginNumber +
                (parseFloat(this.propData.box[item].replace("%", "")) / 100) *
                  module_width_100;
            } else {
              moduleTBMarginNumber =
                moduleTBMarginNumber +
                parseFloat(this.propData.box[item].replace("px", ""));
            }
          }
        });
        moduleHeight = moduleHeight - moduleTBMarginNumber;
      }
      this.moduleHeight = moduleHeight;

      // 计算菜单是否开启紧凑模式
      const containerHeight = moduleHeight - 40;
      this.maxMenu = parseInt(containerHeight / 88);
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      let styleObject = {},
        leftIconStyleObject = {},
        rightIconStyleObject = {},
        leftTopIconStyleObject = {},
        rightTopIconStyleObject = {},
        leftBottomIconStyleObject = {},
        rightBottomIconStyleObject = {};

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
      if(this.propData.translateY || this.propData.translateX){
        let translate = ''
        if(this.propData.translateX){
          translate += `translateX(${this.propData.translateX})`
        }
        if(this.propData.translateY){
          translate += ` translateY(${this.propData.translateY})`
        }
        styleObject["transform"] = translate
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
            case "boxShadow":
              styleObject["box-shadow"] = styleObject["box-shadow"]
                ? element
                : "none";
              break;
            case "font":
              styleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject["color"] = element.fontColors.hex8;
              }
              styleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              styleObject["font-style"] = element.fontStyle;
              styleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              styleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              styleObject["text-align"] = element.fontTextAlign;
              styleObject["text-decoration"] = element.fontDecoration;
              break;
            case "leftIconColor":
              leftIconStyleObject["color"] = IDM.hex8ToRgbaString(element.hex8);
              break;
            case "leftIconSize":
              leftIconStyleObject["font-size"] =
                element.inputVal + element.selectVal;
              break;
            case "rightIconColor":
              rightIconStyleObject["color"] = IDM.hex8ToRgbaString(
                element.hex8
              );
              break;
            case "leftTopIconSize":
              leftTopIconStyleObject["font-size"] =
                element.inputVal + element.selectVal;
              break;
            case "leftTopIconColor":
              leftTopIconStyleObject["color"] = IDM.hex8ToRgbaString(
                element.hex8
              );
              break;
            case "rightTopIconSize":
              rightTopIconStyleObject["font-size"] =
                element.inputVal + element.selectVal;
              break;
            case "rightTopIconColor":
              rightTopIconStyleObject["color"] = IDM.hex8ToRgbaString(
                element.hex8
              );
              break;
            case "leftBottomIconSize":
              leftBottomIconStyleObject["font-size"] =
                element.inputVal + element.selectVal;
              break;
            case "leftBottomIconColor":
              leftBottomIconStyleObject["color"] = IDM.hex8ToRgbaString(
                element.hex8
              );
              break;
            case "rightBottomIconSize":
              rightBottomIconStyleObject["font-size"] =
                element.inputVal + element.selectVal;
              break;
            case "rightBottomIconColor":
              rightBottomIconStyleObject["color"] = IDM.hex8ToRgbaString(
                element.hex8
              );
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-directory-menu-top .i-directory-menu-medal .medal-left span",
        leftIconStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-directory-menu-top .i-directory-menu-medal .medal-right span",
        rightIconStyleObject
      );

      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-directory-menu-bottom > div .i-directory-menu-bottom-btn.left-top span",
        leftTopIconStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-directory-menu-bottom > div .i-directory-menu-bottom-btn.right-top span",
        rightTopIconStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-directory-menu-bottom > div .i-directory-menu-bottom-btn.left-bottom span",
        leftBottomIconStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-directory-menu-bottom > div .i-directory-menu-bottom-btn.right-bottom span",
        rightBottomIconStyleObject
      );
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
          this.menuList = mock;
          this.isThin = this.menuList.length > this.maxMenu;
        }, 500);
      } else if (this.moduleObject.env === "production") {
        let dataSource =
          this.propData.dataSource && this.propData.dataSource[0];
        if (!dataSource) {
          return;
        }
        const params = {
          groupType:this.activeTab
        };
        console.log(params,"参数参数参数")
        IDM.datasource.request(
          dataSource.id,
          {
            moduleObject: this.moduleObject,
            param: params,
          },
          (res) => {
            console.log(res, "目录菜单返回结果");
            if (res) {
              this.menuList = res;
              this.isThin = this.menuList.length > this.maxMenu;
            }
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
      console.log("目录菜单收到消息", messageObject);
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
        case "regionResize":
          if (
            messageObject.message.gridEleTarget &&
            messageObject.message.gridEleTarget.offsetHeight
          ) {
            // console.log("🚀 ~ file: ITodoTabsList.vue ~ line 1757 ~ receiveBroadcastMessage ~ gridEleTarget", gridEleTarget.offsetHeight+"")
            this.resizeContentWrapperHeight(
              messageObject.message.gridEleTarget.offsetHeight
            );
          }
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
            " .i-directory-menu-bottom > div .i-directory-menu-bottom-btn span",
          {
            color: item.mainColor
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
.i-directory-menu-outer {
  width: 240px;
  font-size: 14px;
  color: #333333;
  background-color: #fff;
  position: relative;
  box-shadow: 0px 0px 6px 0px rgba(17, 34, 101, 0.2);
  z-index: 99;

  .i-directory-menu-tab {
    background: #0091ff;
    display: flex;
    text-align: center;
    align-items: center;
    color: #ffffff;
    height: 40px;
    line-height: 40px;

    .i-directory-menu-tab-item {
      position: relative;
      flex: 1;
      cursor: pointer;

      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 1px;
        height: 20px;
        background-color: #fff;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }

      &:last-child::before {
        display: none;
      }

      &.active {
        font-size: 16px;
        font-weight: 600;

        &::after {
          content: "";
          display: block;
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #fff;
          bottom: -5px;
          left: 0;
          right: 0;
          margin: 0 auto;
          transform: rotate(45deg);
        }
      }
    }
  }

  .i-directory-menu-container {
    height: calc(100% - 40px);
    width: 100%;
    overflow: auto;
    &::-webkit-scrollbar-track-piece {
      background-color: #ffffff;
    }

    &::-webkit-scrollbar {
      width: 8px;
      height: 9px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ebebeb;
      background-clip: padding-box;
      min-height: 28px;
      border-radius: 4px;
    }

    .i-directory-menu-container-item {
      width: 100%;
      height: 88px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 10px;
      cursor: pointer;

      &:hover {
        box-shadow: 0px 0px 6px 0px rgba(17, 34, 101, 0.2);
      }

      .container-item-left {
        width: calc(100% - 12px);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .container-item-right {
        width: 12px;
      }

      .container-item-left-first {
        font-size: 16px;
        font-weight: 600;
      }
      .container-item-left-second {
        width: 100%;
        color: #7c7c7c;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        span {
          margin-right: 14px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    &.thin {
      .i-directory-menu-container-item {
        height: 44px;
        padding: 10px;

        .container-item-left {
          flex-direction: initial;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          .container-item-left-second {
            width: auto;
            overflow: initial;
            margin-left: 10px;
          }
        }
      }
    }
  }

  .i-directory-menu-popup {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 20px 10px;
    transform: translateX(100%);
    background-color: #fff;
    box-shadow: 2px 0px 17px 0px rgba(17,34,101,.1);
    writing-mode: vertical-lr;

    .menu-popup-item {
      width: 210px;
      writing-mode: horizontal-tb;
      padding: 0 6px;
    }

    .popup-item-second {
      display: inline-block;
      width: 100%;
      font-size: 18px;
      padding: 10px 0;
      
      &:hover {
        color: #0079FF;
      }
    }

    .popup-item-third {
      font-size: 14px;
      color: #7c7c7c;

      span{
        margin-left: 20px;
        &:first-child {
          margin-left: 0;
        }
        &:hover {
          color: #0079FF;
        }
      }
    }
  }
}
</style>
