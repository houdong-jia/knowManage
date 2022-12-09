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
    class="i-tempalte-panel-outer"
    ref="panelOuter"
    v-show="isShow"
  >
    <div class="i-tempalte-panel-header" ref="panelHeader">
      <div class="i-tempalte-panel-tit" v-if="propData.showTitle">
        <span>{{ propData.title }}</span>
      </div>
      <div class="i-tempalte-panel-tab" v-if="propData.showTab">
        <p
          v-for="(tab, t) in infoList"
          :key="t"
          :class="{ active: activeTab === tab.id }"
          :title="tab.title"
          @click="toggleTab(tab)"
        >
          {{ tab.title }}
        </p>
      </div>
    </div>
    <div
      class="i-tempalte-panel-container"
      :class="{
        show: propData.pagingBtn === 'show',
        hover: propData.pagingBtn === 'hover',
      }"
    >
      <div
        class="c-tab left"
        :class="{ 'c-tab-disabled': pageIndex === 0 }"
        @click="togglePage('lt')"
      >
        <svg
          class="img_left"
          version="1.0"
          width="16pt"
          height="24pt"
          viewBox="0 0 16 24"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform="translate(0,24) scale(0.1,-0.1)" stroke="none">
            <path
              d="M72 177 l-63 -52 53 -48 c82 -74 95 -77 54 -12 l-36 56 35 54 c19 30 31 55 27 54 -4 0 -35 -23 -70 -52z"
            />
          </g>
        </svg>
      </div>

      <div
        class="i-tempalte-panel-wrapper"
        :class="{ no_data: !curPageList.length }"
      >
        <template v-if="pageSize">
          <template v-for="(item, i) in curPageList">
            <div
              v-if="!item.isAdd"
              :key="i"
              class="i-tempalte-panel-item"
              :class="{ isEmpty: item.isEmpty }"
              @click="itemClick(item)"
            >
              <div class="i-tempalte-panel-item-img">
                <img v-if="item.img" :src="IDM.url.getWebPath(item.img)" />
                <img
                  v-else
                  :src="
                    IDM.url.getModuleAssetsWebPath(
                      require('../assets/default_template.png'),
                      moduleObject
                    )
                  "
                />
              </div>
              <span :title="item.title">{{ item.title }}</span>
            </div>
            <div
              v-else
              :key="i"
              class="i-tempalte-panel-item isAdd"
              @click="addClick"
            >
              <div class="i-tempalte-panel-add">
                <svg-icon icon-class="add" />
                <i>空白文档</i>
              </div>
            </div>
          </template>
        </template>
        <a-empty
          v-if="!curPageList.length"
          :image="simpleImage"
          description="暂无数据"
        />
      </div>
      <div
        class="c-tab right"
        :class="{ 'c-tab-disabled': pageIndex === maxPageIndex }"
        @click="togglePage('lr')"
      >
        <svg
          class="img_left"
          style="transform: rotate(180deg)"
          version="1.0"
          width="16pt"
          height="24pt"
          viewBox="0 0 16 24"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform="translate(0,24) scale(0.1,-0.1)" stroke="none">
            <path
              d="M72 177 l-63 -52 53 -48 c82 -74 95 -77 54 -12 l-36 56 35 54 c19 30 31 55 27 54 -4 0 -35 -23 -70 -52z"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
const mock = {
  suggest: [
    {
      title: "推荐模板",
      id: "1001",
      list: [
        {
          id: "2001",
          title: "推荐一简约商务风工作总结汇报",
          img: "",
        },
        {
          id: "2002",
          title: "推荐二工作日报总结计划",
          img: "",
        },
        {
          id: "2003",
          title: "推荐三工作计划",
          img: "",
        },
        {
          id: "2001",
          title: "推荐四简约商务风工作总结汇报",
          img: "",
        },
        {
          id: "2002",
          title: "推荐五工作日报总结计划",
          img: "",
        },
      ],
    },
  ],
  common: [
    {
      title: "工作必备",
      id: "1001",
      list: [
        {
          id: "2001",
          title: "简约商务风工作总结汇报",
          img: "",
        },
        {
          id: "2002",
          title: "工作日报总结计划",
          img: "",
        },
        {
          id: "2003",
          title: "工作计划",
          img: "",
        },
        {
          id: "2001",
          title: "简约商务风工作总结汇报",
          img: "",
        },
        {
          id: "2002",
          title: "工作日报总结计划",
          img: "",
        },
      ],
    },
    {
      title: "会议记录",
      id: "1002",
      list: [
        {
          id: "2001",
          title: "工作日报总结计划",
          img: "",
        },
      ],
    },
    {
      title: "工作计划",
      id: "1003",
      list: [],
    },
    {
      title: "工作计划",
      id: "1004",
      list: [
        {
          id: "2001",
          title: "工作计划",
          img: "",
        },
      ],
    },
    {
      title: "工作计划",
      id: "1005",
      list: [
        {
          id: "2001",
          title: "工作计划",
          img: "",
        },
      ],
    },
  ],
  person: [],
  unit: [
    {
      title: "工作必备",
      id: "1001",
      list: [],
    },
    {
      title: "会议记录",
      id: "1002",
      list: [],
    },
    {
      title: "工作计划",
      id: "1003",
      list: [],
    },
    {
      title: "工作计划",
      id: "1004",
      list: [],
    },
    {
      title: "工作计划",
      id: "1005",
      list: [],
    },
  ],
};
import { Empty } from "ant-design-vue";
export default {
  name: "ITemplatePanel",
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        field: "common",
        showTitle: true,
        title: "公共模板",
        showTab: true,
        pagingBtn: "show",
        showAdd: false,
      },
      // 总数据
      infoList: [],
      // 当前激活页签
      activeTab: "",
      // 当前页面下的列表
      curList: [],
      // 每页数据
      pageSize: 0,
      // 当前页下标
      pageIndex: 0,
      // 最大页数
      maxPageIndex: 0,
      // 是否显示组件
      isShow: true,
    };
  },
  props: {},
  watch: {
  },
  computed: {
    // 当前页面展示列表
    curPageList() {
      const list = this.curList.slice(
        this.pageIndex * this.pageSize,
        (this.pageIndex + 1) * this.pageSize
      );
      if (this.maxPageIndex === this.pageIndex) {
        const length = list.length;
        if (length > 0) {
          for (let i = 0; i < this.pageSize - length; i++) {
            list.push({ isEmpty: true });
          }
        }
      }
      return list;
    },
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertThemeListAttrToStyleObject();
    this.convertAttrToStyleObject();
    this.initPropData();

    // 开发环境数据
    if (!this.moduleObject.env || this.moduleObject.env == "develop") {
      setTimeout(() => {
        if (mock[this.propData.field] && mock[this.propData.field].length > 0) {
          const result = JSON.parse(JSON.stringify(mock[this.propData.field]));
          let empty = true;
          result.forEach((item) => {
            if (item.list.length > 0) empty = false;
          });
          if (!empty) {
            this.isShow = true;
            this.infoList = result;
            this.activeTab =
              this.infoList && this.infoList[0] && this.infoList[0].id;
          } else {
            this.isShow = false;
          }
        } else {
          this.isShow = false;
        }
      }, 500);
    }
  },
  mounted() {},
  destroyed() {},
  methods: {
    updateCurList(){
      this.infoList.forEach((item) => {
        if (item.id === this.activeTab) {
          this.curList = item.list;
          if (this.propData.showAdd && !this.curList[0].isAdd)
            this.curList.unshift({ isAdd: true });
          if (!this.propData.showAdd && this.curList[0].isAdd)
            this.curList.shift();
          this.pageIndex = 0;
          if (this.pageSize) {
            this.maxPageIndex = parseInt(this.curList.length / this.pageSize);
            if (this.curList.length % this.pageSize > 0) this.maxPageIndex + 1;
          }
        }
      });
    },
    /**
     * 点击模板
     */
    itemClick(item) {
      // 搜索自定义函数
      const func = this.propData.clickFunction;
      func &&
        window[func[0].name] &&
        window[func[0].name].call(this, {
          ...this.commonParam(),
          customParam: func[0].param,
          _this: this,
          field: this.propData.field,
          activeTab: this.activeTab,
          item,
        });
    },
    /**
     * 点击新建
     */
    addClick() {
      // 搜索自定义函数
      const func = this.propData.addFunction;
      func &&
        window[func[0].name] &&
        window[func[0].name].call(this, {
          ...this.commonParam(),
          customParam: func[0].param,
          _this: this,
          field: this.propData.field,
          activeTab: this.activeTab,
        });
    },
    /**
     * 页签点击
     */
    toggleTab(tab) {
      this.activeTab = tab.id;
      this.updateCurList()
    },
    /**
     * 分页切换
     */
    togglePage(type) {
      type === "lr" ? this.pageIndex++ : this.pageIndex--;
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
      // 计算一屏可以放下几个模板
      this.$nextTick(() => {
        // 最外层宽度
        const panelOuter =
          (this.$refs.panelOuter && this.$refs.panelOuter.clientWidth) || 0;
        // 左侧宽度
        const panelHeader =
          (this.$refs.panelHeader && this.$refs.panelHeader.clientWidth) || 0;
        // 右侧宽度 -padding-margin
        let wrapperWidth = panelOuter - panelHeader - 40 - 20;
        // 减去切换按钮宽度
        if (this.propData.pagingBtn !== "hidden") wrapperWidth -= 32;
        // 模块宽度
        const itemWidth = parseInt(this.propData.innerWidth) || 176;
        // 模块margin
        const itemMargin = this.propData.innerBox
          ? (parseInt(this.propData.innerBox.marginRightVal) || 10) +
            (parseInt(this.propData.innerBox.marginLeftVal) || 10)
          : 20;
        // 模块border
        const itemBorder =
          this.propData.innerBorder && this.propData.innerBorder.border
            ? (parseInt(this.propData.innerBorder.border.left.width) || 1) +
              (parseInt(this.propData.innerBorder.border.right.width) || 10)
            : 2;

        this.pageSize = parseInt(
          wrapperWidth / (itemWidth + itemMargin + itemBorder)
        );
        this.maxPageIndex = parseInt(this.curList.length / this.pageSize);
        if (this.curList.length % this.pageSize > 0) this.maxPageIndex + 1;
      });

      if (this.propData.showAdd && this.curList[0] && !this.curList[0].isAdd)
        this.curList.unshift({ isAdd: true });
      if (!this.propData.showAdd && this.curList[0] && this.curList[0].isAdd)
        this.curList.shift();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      let styleObject = {},
        innerStyleObject = {},
        innerSpanStyleObject = {},
        titleStyleObject = {},
        tabStyleObject = {};

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
            case "titleBgColor":
              if (element && element.hex8) {
                titleStyleObject["background-color"] =
                  element.hex8 + "!important";
              }
              break;
            case "innerBgColor":
              if (element && element.hex8) {
                innerStyleObject["background-color"] = element.hex8;
                innerSpanStyleObject["background-color"] = element.hex8;
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
            case "boxShadow":
              styleObject["box-shadow"] = styleObject["box-shadow"]
                ? element
                : "none";
              break;
            case "innerBoxShadow":
              innerStyleObject["box-shadow"] = innerStyleObject["box-shadow"]
                ? element
                : "none";
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
            case "titleFont":
              titleStyleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                titleStyleObject["color"] = element.fontColors.hex8;
              }
              titleStyleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              titleStyleObject["font-style"] = element.fontStyle;
              titleStyleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              titleStyleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              titleStyleObject["text-align"] = element.fontTextAlign;
              titleStyleObject["text-decoration"] = element.fontDecoration;
              break;
            case "tabFont":
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
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-tempalte-panel-container .i-tempalte-panel-item",
        innerStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-tempalte-panel-container .i-tempalte-panel-item span",
        innerSpanStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-tempalte-panel-header .i-tempalte-panel-tit",
        titleStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .i-tempalte-panel-header .i-tempalte-panel-tab p",
        tabStyleObject
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
      console.log("模板面板组件收到消息", messageObject);
      
      switch (messageObject.type) {
        case "websocket":
          break;
        case "linkageReload":
          this.propDataWatchHandle();
          break;
        case "pageResize":
          this.initPropData();
          break;
        case "sendTemplateData":
          if (
            messageObject.message &&
            messageObject.message[this.propData.field] &&
            messageObject.message[this.propData.field].length > 0
          ) {
            let empty = true;
            const result = messageObject.message[this.propData.field];
            result.forEach((item) => {
              if (item.list.length > 0) empty = false;
            });
            if (!empty) {
              this.isShow = true;
              this.infoList = result;
              this.activeTab = this.infoList && this.infoList[0] && this.infoList[0].id;
              this.updateCurList();
            } else {
              this.isShow = false;
            }
          } else {
            this.isShow = false;
          }
          this.$forceUpdate()
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
            " .i-tempalte-panel-outer .i-tempalte-panel-header .i-tempalte-panel-tit",
          {
            background: item.minorColor
              ? IDM.hex8ToRgbaString(item.minorColor.hex8)
              : "",
          }
        );

        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .i-tempalte-panel-container .i-tempalte-panel-item .i-tempalte-panel-add .svg-icon",
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
            " .i-tempalte-panel-outer .i-tempalte-panel-container .c-tab .img_left",
          {
            fill: item.mainColor
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
.i-tempalte-panel-outer {
  width: 100%;
  display: flex;
  background-color: #fff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  height: 248px;
  border-radius: 6px;

  .i-tempalte-panel-header {
    display: flex;
    padding: 2px;

    .i-tempalte-panel-tit {
      height: 100%;
      background: #e9f7ff;
      border-radius: 6px 0px 0px 6px;
      padding: 0 20px;
      writing-mode: vertical-lr;
      font-size: 16px;
      color: #333333;
      text-align: center;
      letter-spacing: 20px;
      font-weight: 600;

      span {
        position: relative;
        margin-bottom: -20px;
      }
    }
    .i-tempalte-panel-tab {
      padding: 14px 16px;
      height: 100%;
      overflow: auto;
      width: 160px;

      &::-webkit-scrollbar-track-piece {
        background-color: #eeeeee45;
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

      p {
        font-size: 14px;
        color: #666666;
        padding: 16px 0;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 0;
        cursor: pointer;

        &.active {
          font-size: 16px;
          color: #333333;
          font-weight: 600;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .i-tempalte-panel-container {
    display: flex;
    padding: 20px;
    width: 100%;

    &.show {
      .c-tab {
        display: block;
      }
    }
    &.hover {
      .c-tab {
        display: block;
        opacity: 0;

        &.c-tab-disabled {
          opacity: 0;
        }
      }

      &:hover {
        .c-tab {
          opacity: 1;
          &.c-tab-disabled {
            opacity: 0.5;
          }
        }
      }
    }

    .c-tab {
      position: relative;
      display: none;
      cursor: pointer;
      font-size: 22px;
      color: #0091ff;
      width: 16px;

      &.c-tab-disabled {
        opacity: 0.5;
        pointer-events: none;
      }
      .img_left {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        width: 16px;
        height: 24px;
        fill: #0091ff;
      }
    }

    .i-tempalte-panel-wrapper {
      display: flex;
      align-items: center;
      margin: 0 10px;
      width: 100%;
      justify-content: space-between;

      &.no_data {
        justify-content: space-around;
      }

      ::v-deep .ant-empty-description {
        color: #ccc;
        text-align: center;
      }
    }

    .i-tempalte-panel-item {
      position: relative;
      width: 176px;
      height: 186px;
      border: 1px solid rgba(232, 232, 232, 1);
      box-shadow: 0px -4px 8px 0px rgb(0 0 0 / 6%);
      border-radius: 6px;
      padding-bottom: 40px;
      margin: 0 10px;
      user-select: none;
      cursor: pointer;
      font-size: 14px;

      &.isEmpty {
        opacity: 0;
        pointer-events: none;
      }

      &.isAdd {
        padding: 8px;
      }

      .i-tempalte-panel-item-img {
        padding: 8px 8px 0 8px;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }

      span {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: currentColor;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        border-radius: 0 0 6px 6px;
      }

      .i-tempalte-panel-add {
        width: 100%;
        height: 100%;
        border: 1px dashed #e8e8e8;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        i {
          font-style: normal;
          color: currentColor;
        }

        .svg-icon {
          color: #0091ff;
          font-size: 30px;
          margin-bottom: 18px;
        }
      }
    }
  }
}
</style>
