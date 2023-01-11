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
    class="i-know-time-axis-outer"
  >
    <knowmanage-a-list
      item-layout="horizontal"
      :data-source="infoList"
      :locale="{ emptyText: '暂无数据' }"
    >
      <template #loadMore v-if="infoList.length > 0">
        <div class="i-know-time-axis-more">
          <template v-if="!loadFinish">
            <a-spin v-if="loadingMore" />
            <knowmanage-a-button v-else @click="loadMoreHandler"
              >加载更多</knowmanage-a-button
            >
          </template>
          <span v-else>没有更多了</span>
        </div>
      </template>
      <template>
        <div
          class="time-axis-section"
          v-for="(item, index) in infoList"
          :key="index"
        >
          <div class="section-time" :class="{ frist: index === 0 }">
            {{ formatDate(item.date) }}
          </div>
          <div class="section-content">
            <div
              class="section-item"
              v-for="(list, l) in item.list"
              :key="l"
              :class="{ frist: (index === 0) & (l === 0) }"
              @click="sectionClick(item)"
            >
              <div class="section-item-circle">
                <div class="circle-inner"></div>
              </div>
              <div class="section-item-line"></div>
              <div class="section-item-title" v-html="list.title"></div>
              <div class="section-item-desc" v-html="list.desc"></div>
              <div class="section-item-field">
                <div class="field-bar">
                  <div
                    v-for="(content, c) in contentList"
                    :key="c"
                    :class="{
                      'field-bar-left': c === 0,
                      'field-bar-right': c === 1,
                    }"
                    :style="`min-width:${c === 0 ? propData.leftMinWidth : propData.rightMinWidth};text-align:${c === 0 ? 'left' : 'right'}`"
                  >
                    <template v-for="(field, f) in content">
                      <span
                        class="type-field"
                        :key="f"
                        v-if="
                          field.type === 'field' &&
                          (field.showType == 'default' || list[field.displayBy])
                        "
                      >
                        {{ field.fieldName }}：{{ list[field.fieldKey] }}
                      </span>
                      <span
                        class="type-reply"
                        :key="f"
                        v-if="
                          field.type === 'reply' &&
                          (field.showType == 'default' || list[field.displayBy])
                        "
                      >
                        {{ field.desc }}
                      </span>
                      <span
                        class="type-reply ed"
                        :key="f"
                        v-if="
                          field.type === 'replyed' &&
                          (field.showType == 'default' || list[field.displayBy])
                        "
                      >
                        被
                        <img
                          v-if="list.avatar"
                          :src="IDM.url.getWebPath(list.avatar)"
                        />
                        <img
                          v-else
                          :src="
                            IDM.url.getModuleAssetsWebPath(
                              require('../assets/default_avatar.png'),
                              moduleObject
                            )
                          "
                        />
                        <span class="type-reply-username">{{
                          list.username
                        }}</span>
                        {{ field.desc }}
                      </span>
                      <span
                        class="type-btn"
                        :key="f"
                        v-if="
                          field.type === 'btn' &&
                          (field.showType == 'default' || list[field.displayBy])
                        "
                        :class="{ active: field.active }"
                        @click="btnHanlder(field, list)"
                      >
                      <template v-if="field.showIcon">
                        <svg
                          v-if="field.icon && field.icon[0]"
                          class="idm_filed_svg_icon"
                          aria-hidden="true"
                        >
                          <use :xlink:href="`#${field.icon[0]}`"></use>
                        </svg>
                        <svg-icon v-else icon-class="upload" />
                      </template>
                        {{ field.desc }}
                      </span>
                    </template>
                  </div>
                </div>
                <div class="field-reply" v-if="propData.showReply">
                  {{ list.replyContent }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </knowmanage-a-list>
  </div>
</template>

<script>
const mock = {
  total: 8,
  list: [
    {
      date: "2023-01-09",
      list: [
        {
          title: "Orcale 数据库的安装和配置",
          desc: "Oracle Database，又名Oracle RDBMS，或简称Oracle。是甲骨文公司的一款关系数据库管理系统。它是在数据库领域一直处于领先地位的产品。可以说Oracle数据库系统是世界上流行的关系数据库管理系统……….",
          type: "文档",
          publishTime: "2022-09-22 14:34",
          replyContent: "xxxxxxx",
          avatar: "",
          username: "张三",
          reply: true
        },
        {
          title: "Orcale 数据库的安装和配置",
          desc: "Oracle Database，又名Oracle RDBMS，或简称Oracle。是甲骨文公司的一款关系数据库管理系统。它是在数据库领域一直处于领先地位的产品。可以说Oracle数据库系统是世界上流行的关系数据库管理系统……….",
          type: "文档",
          publishTime: "2022-09-22 14:34",
          replyContent: "xxxxxxx",
          avatar: "",
          username: "张三",
          byReply: true,
        },
      ],
    },
    {
      date: "2023-01-08",
      list: [
        {
          title: "Orcale 数据库的安装和配置",
          desc: "Oracle Database，又名Oracle RDBMS，或简称Oracle。是甲骨文公司的一款关系数据库管理系统。它是在数据库领域一直处于领先地位的产品。可以说Oracle数据库系统是世界上流行的关系数据库管理系统……….",
          type: "文档",
          publishTime: "2022-09-22 14:34",
        },
      ],
    },
    {
      date: "2022-12-25",
      list: [
        {
          title: "Orcale 数据库的安装和配置",
          desc: "Oracle Database，又名Oracle RDBMS，或简称Oracle。是甲骨文公司的一款关系数据库管理系统。它是在数据库领域一直处于领先地位的产品。可以说Oracle数据库系统是世界上流行的关系数据库管理系统……….",
          type: "文档",
          publishTime: "2022-09-22 14:34",
        },
      ],
    },
  ],
};

import moment from "moment";
export default {
  name: "IPersonCenter",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        showReply: true,
        contentList: [
          {
            type: "reply",
            desc: "我的纠错",
            position: "left",
            displayBy: "reply",
            showType: "field",
          },
          {
            type: "replyed",
            desc: "纠错",
            position: "left",
            displayBy: "byReply",
            showType: "field",
          },
          {
            type: "field",
            position: "left",
            fieldName: "时间",
            fieldKey: "publishTime",
            showType: "default",
          },
          {
            type: "btn",
            position: "right",
            desc: "取消协作",
            displayBy: "noteamup",
            showIcon:true,
            icon: [""],
            showType: "default",
          },
        ],
        autoLoad:true
      },
      infoList: [],
      infoListLength:0,
      contentList: [],
      loadingMore: false,
      limit: 10,
      start: 0,
      loadFinish: false,
      filterParams: {},
      custParams: {},
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
     * 格式化日期
     */
    formatDate(d) {
      const today = moment(moment(new Date()).format("YYYY-MM-DD")).format("x");
      const yesterday = today - 24 * 60 * 60 * 1000;
      const date = moment(d).format("x");
      return date == today ? "今天" : date == yesterday ? "昨天" : d;
    },
    /**
     * 加载更多
     */
    loadMoreHandler() {
      this.initData();
    },
    /**
     * 按钮点击
     */
    btnHanlder(field, list) {
      const func = field.btnFunction;
      func &&
        window[func[0].name] &&
        window[func[0].name].call(this, {
          ...this.commonParam(),
          customParam: func[0].param,
          item: list,
          _this: this,
        });
    },
    /**
     * 当前条目点击
     */
    sectionClick(item) {
      const func = this.propData.clickFunction;
      func &&
        window[func[0].name] &&
        window[func[0].name].call(this, {
          ...this.commonParam(),
          customParam: func[0].param,
          item: item,
          _this: this,
        });
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

      if (this.propData.contentList && this.propData.contentList.length > 0) {
        const left = [];
        const right = [];
        this.propData.contentList.forEach((item) => {
          if (item.position === "left") {
            left.push(item);
          } else if (item.position === "right") {
            right.push(item);
          }
        });
        this.contentList = [left, right];
      }
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      let styleObject = {};

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
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);

      if(this.propData.autoLoad){
        this.infoList = [];
        this.infoListLength = 0;
        this.initData();
      }
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
    initData(limit,start) {
      this.loadMore = true;
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        setTimeout(() => {
          this.loadMore = false;
          const list = JSON.parse(JSON.stringify(mock.list));
          this.infoList = [...this.infoList, ...list];
          let length = 0;
          this.infoList.forEach((item) => {
            length += item.list.length;
          });
          this.loadFinish = length >= mock.total;
        }, 500);
      } else if (this.moduleObject.env === "production") {
        let dataSource =
          this.propData.dataSource && this.propData.dataSource[0];
        if (!dataSource) {
          return;
        }
        const param = {
          limit: limit || this.propData.limit,
          start: start || this.infoListLength,
          ...this.filterParams,
          ...this.custParams,
        };
        IDM.datasource.request(
          dataSource.id,
          {
            moduleObject: this.moduleObject,
            param,
          },
          (res) => {
            console.log(res, "知识时间轴接口返回结果");
            this.loadMore = false;
            this.infoList = [...this.infoList, ...res.list];
            let length = 0;
            this.infoList.forEach((item) => {
              length += item.list.length;
            });
            this.infoListLength = length
            this.loadFinish = length >= res.total;
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
      console.log("知识时间轴组件收到消息", messageObject);
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
                this.infoList = [];
                this.infoListLength = 0;
                this.initData();
              }
            }
          }
          break;
        case "linkageReload":
          this.propDataWatchHandle();
          break;
        case "linkageResult":
          this.filterParams[messageObject.messageKey] =
            typeof messageObject.message === "object"
              ? messageObject.message.value
              : messageObject.message;
          this.infoList = [];
          this.infoListLength = 0;
          this.initData();
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
            " .i-know-time-axis-container .i-know-time-axis-right .right-item .right-num",
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
            " .i-know-time-axis-container .i-know-time-axis-left .user-info .user-info-top .title",
          {
            "box-shadow": item.mainColor
              ? `0 1px 1px 0 ${IDM.hex8ToRgbaString(item.mainColor.hex8)}`
              : "",
          }
        );
      }
    },
  },
};
</script>
<style scoped lang="scss">
.i-know-time-axis-outer {
  width: 100%;
  font-size: 14px;
  color: #666666;
  padding: 10px;

  .i-know-time-axis-more {
    text-align: center;
    margin: 14px 0;
    height: 32px;
    line-height: 32px;
  }

  .time-axis-section {
    display: flex;
    width: 100%;

    .section-time {
      width: 100px;
      text-align: right;
      margin-top: 22px;
      &.frist {
        margin-top: 0;
      }
    }

    .section-content {
      width: calc(100% - 100px);
      margin-left: 14px;

      .section-item {
        position: relative;
        // border-left: 1px solid #d8d8d8;
        padding-top: 20px;
        cursor: pointer;

        &.frist {
          padding-top: 0;

          .section-item-circle {
            top: 6px;
          }

          .section-item-line {
            height: calc(100% - 10px);
            top: 10px;
          }
        }

        & > div {
          margin-left: 14px;
        }

        .section-item-circle {
          position: absolute;
          left: -6px;
          top: 26px;
          width: 11px;
          height: 11px;
          border: 1px solid rgba(216, 216, 216, 1);
          margin-left: 0;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          z-index: 1;

          .circle-inner {
            background-color: rgba(216, 216, 216, 1);
            width: 5px;
            height: 5px;
            border-radius: 50%;
          }
        }

        .section-item-line {
          position: absolute;
          width: 1px;
          height: 100%;
          left: -1px;
          top: 0;
          margin-left: 0;
          background-color: rgba(216, 216, 216, 1);
        }

        .section-item-title {
          font-size: 16px;
          color: #333333;
          font-weight: 600;
          margin-bottom: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .section-item-desc {
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 3;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
        .section-item-field {
          margin-top: 14px;
          font-size: 14px;
          color: #999999;
          border-bottom: 1px dashed rgba(229, 229, 229, 1);
          padding-bottom: 20px;

          .field-bar {
            display: flex;
            justify-content: space-between;

            .field-bar-left span {
              margin-right: 20px;
            }
            .field-bar-right span {
              margin-left: 20px;
            }

            .type-reply {
              font-size: 16px;
              color: #0079ff;
              font-weight: 600;

              img {
                width: 26px;
                height: 26px;
                border-radius: 50%;
                vertical-align: bottom;
                margin: 0 4px;
              }

              .type-reply-username {
                font-size: 16px;
                color: #333333;
                font-weight: normal;
                margin-right: 0;
              }
            }
            .type-btn {
              &.active {
                color: #0079ff;
              }
              .idm_filed_svg_icon {
                width: 1em;
                height: 1em;
                vertical-align: -0.2em;
                fill: currentColor;
                overflow: hidden;
              }
            }
          }

          .field-reply {
            margin-top: 6px;
            color: #666666;
          }
        }
      }
    }
  }
}
</style>
