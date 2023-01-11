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
    class="i-know-card-outer"
  >
    <div class="i-know-card-topic" v-for="(topic, t) in cardList" :key="t">
      <div class="i-know-card-topic-title">{{ topic.title }}</div>
      <div class="i-know-card-col" v-for="(col, c) in topic.list" :key="c">
        <div
          class="i-know-card-item"
          v-for="(item, i) in col"
          :key="i"
          :class="{ emtpy: item.emtpy }"
          @click="cardClick(item)"
        >
          <template v-if="!item.emtpy">
            <div
              class="item-top"
              :style="`background-image:url(${IDM.url.getWebPath(item.img)})`"
            >
              <span class="item-top-tit">{{ item.title }}</span>
              <span class="item-top-view"
                ><svg-icon icon-class="view" />{{ item.view }}</span
              >
            </div>
            <div class="item-bottom">
              <div
                class="item-bottom-label"
              >
                <span v-for="(label, l) in item.label.split(',')" :key="l">{{
                  label
                }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const mock = [
  {
    title: "专题目录1",
    list: [
      {
        title: "知识文档1",
        id: "1001",
        view: "180",
        label: "标签1,标签2",
        num: 5,
      },
      {
        title: "知识文档2",
        id: "1002",
        view: "180",
        label: "标签1,标签2",
      },
      {
        title: "知识文档3",
        id: "1003",
        view: "180",
        label: "标签1,标签2",
      },
      {
        title: "知识文档3",
        id: "1003",
        view: "180",
        label: "标签1,标签2",
      },
      {
        title: "知识文档3",
        id: "1003",
        view: "180",
        label: "标签1,标签2",
      },
      {
        title: "知识文档3",
        id: "1003",
        view: "180",
        label: "标签1,标签2",
      },
      {
        title: "知识文档3",
        id: "1003",
        view: "180",
        label: "标签1,标签2",
      },
      {
        title: "知识文档3",
        id: "1003",
        view: "180",
        label: "标签1,标签2",
      },
      {
        title: "知识文档3",
        id: "1003",
        view: "180",
        label: "标签1,标签2",
      },
    ],
  },
  {
    title: "专题目录2",
    list: [
      {
        title: "知识文档1",
        id: "1001",
        view: "180",
        label: "标签1,标签2",
      },
      {
        title: "知识文档2",
        id: "1002",
        view: "180",
        label: "标签1,标签2",
      },
      {
        title: "知识文档3",
        id: "1003",
        view: "180",
        label: "标签1,标签2",
      },
      {
        title: "知识文档3",
        id: "1003",
        view: "180",
        label: "标签1,标签2",
      },
    ],
  },
];
export default {
  name: "IKnowCard",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        colRow: 7,
      },
      cardList: [],
      // 数据源刷新key
      dataSourceRefresh: [],
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
    cardClick(item) {
      const func = this.propData.clickFunction?.[0];
      if (func) {
        window[func.name] &&
          window[func.name].call(this, {
            item,
            customParam: func.param,
            commonParam:this.commonParam(),
            _this: this,
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
      // 数据源解析
      if (this.propData.dataSource && this.propData.dataSource[0]) {
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
        innerStyleObject = {};

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
              innerStyleObject["width"] = element;
              break;
            case "innerHeight":
              innerStyleObject["height"] = element;
              break;
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] = element.hex8;
              }
              break;
            case "innerBgColor":
              if (element && element.hex8) {
                innerStyleObject["background-color"] = element.hex8;
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
                    element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                innerStyleObject["border-right-width"] =
                  element.border.right.width + element.border.right.widthUnit;
                innerStyleObject["border-right-style"] =
                  element.border.right.style;
                if (element.border.right.colors.hex8) {
                  innerStyleObject["border-right-color"] =
                    element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                innerStyleObject["border-bottom-width"] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                innerStyleObject["border-bottom-style"] =
                  element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  innerStyleObject["border-bottom-color"] =
                    element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                innerStyleObject["border-left-width"] =
                  element.border.left.width + element.border.left.widthUnit;
                innerStyleObject["border-left-style"] =
                  element.border.left.style;
                if (element.border.left.colors.hex8) {
                  innerStyleObject["border-left-color"] =
                    element.border.left.colors.hex8;
                }
              }

              innerStyleObject["border-top-left-radius"] =
                element.radius.leftTop.radius +
                element.radius.leftTop.radiusUnit;
              innerStyleObject["border-top-right-radius"] =
                element.radius.rightTop.radius +
                element.radius.rightTop.radiusUnit;
              innerStyleObject["border-bottom-left-radius"] =
                element.radius.leftBottom.radius +
                element.radius.leftBottom.radiusUnit;
              innerStyleObject["border-bottom-right-radius"] =
                element.radius.rightBottom.radius +
                element.radius.rightBottom.radiusUnit;
              break;
            case "font":
              innerStyleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject["color"] = element.fontColors.hex8;
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
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .i-know-card-col .i-know-card-item",
        innerStyleObject
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
    cutArray(array, subLength) {
      let index = 0;
      let newArr = [];
      while (index < array.length) {
        const arr = array.slice(index, (index += subLength));
        const arrLength = arr.length;
        if (arrLength < subLength) {
          for (let i = 0; i < subLength - arrLength; i++) {
            arr.push({
              emtpy: true,
            });
          }
        }
        newArr.push(arr);
      }
      return newArr;
    },

    /**
     * 加载动态数据
     */
    initData() {
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        setTimeout(() => {
          const res = JSON.parse(JSON.stringify(mock));
          res.forEach((item) => {
            item.list = this.cutArray(item.list, this.propData.colRow);
          });
          this.cardList = res;
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
            param: {
              subjectId: IDM.url.queryString("subjectId"),
            },
          },
          (res) => {
            console.log(res, "接口返回结果");
            res.forEach((item) => {
              item.list = this.cutArray(item.list, this.propData.colRow);
            });
            this.cardList = res;
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
            " .i-know-card-col .i-know-card-item .item-top .item-top-num span",
          {
            color: item.mainColor
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
            " .i-know-card-col .i-know-card-item .item-bottom .item-bottom-enter",
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
.i-know-card-outer {
  width: 100%;

  .i-know-card-topic-title {
    font-size: 16px;
    color: #333333;
    font-weight: 600;
    padding: 10px 0;
  }

  .i-know-card-col {
    display: flex;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .i-know-card-item {
      width: 200px;
      height: 145px;
      margin-right: 20px;
      background: #ffffff;

      &.emtpy {
        pointer-events: none;
        background-color: transparent;
      }

      &:last-child {
        margin-right: 0;
      }

      .item-top {
        height: 108px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
        background-size: 100% 100%;

        .item-top-tit {
          font-size: 16px;
          color: #333333;
        }
        .item-top-view {
          font-size: 12px;
          color: #999999;
        }
        .item-top-num {
          font-size: 12px;
          margin-top: 3px;
          span {
            color: #0091ff;
            margin-right: 4px;
          }
        }
      }
      .item-bottom {
        width: 100%;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
        font-size: 12px;
        color: #999999;

        span {
          margin-left: 18px;
        }

        .item-bottom-label {
          width: 100%;
          height: 37px;
          line-height: 37px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .item-bottom-enter {
          height: 42px;
          line-height: 42px;
          color: #0091ff;
          text-align: center;
          font-size: 16px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
