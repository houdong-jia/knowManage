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
    class="i-docList-outer"
    ref="module_ref"
    :style="
      propData.heightType == 'adaptive' ? { height: moduleHeight + 'px' } : {}
    "
  >
    <div key="i-docList-content" class="i-docList-content">
      <div class="i-docList-content-item" v-for="item,index in data" :key="index" @click="onItemClick(item, index)">
        <div class="item-title">
          <div class="img" v-if="propData.imageField">
            <img
              width="100%"
              height="100%"
              :src="
                IDM.url.getWebPath(getExpressData('data', propData.imageField, item))
              "
            />
          </div>
          <div class="title" v-if="propData.titleFiled">{{getExpressData('data', propData.titleFiled, item)}}</div>
          <div
            class="tag"
            v-if="propData.titleTagName"
            v-show="propData.titleTagCompareField ? propData.titleTagCompareValue ? item[propData.titleTagCompareField] == propData.titleTagCompareValue : item[propData.titleTagCompareField] : true"
          >
            {{propData.titleTagName}}
          </div>
        </div>
        <div class="item-content" v-if="propData.extraPosition == 'bottom' && propData.contentFiled" v-html="getExpressData('data', propData.contentFiled, item)" />
        <div class="item-extra" v-if="propData.extraList && propData.extraList.length">
          <template v-for="extra,eindex in propData.extraList">
            <div
              v-if="extra.key"
              v-show="extra.compareField ? extra.compareValue ? item[extra.compareField] == extra.compareValue : item[extra.compareField] : true"
              :key="eindex"
              :class="`item item-${extra.key}`"
              :style="{float: extra.position}"
              @click.stop="onExtraClick(extra,item,index)"
            >
              <div class="icon" v-if="extra.icon && extra.icon.length">
                <svg
                  class="idm_filed_svg_icon"
                  aria-hidden="true"
                >
                  <use :xlink:href="`#${extra.icon && extra.icon[0]}`" />
                </svg>
              </div>
              <div class="text">
                {{extra.textFiled.includes("@[") ? IDM.express.replace(extra.textFiled, item, true) : extra.textFiled}}
              </div>
            </div>
          </template>
        </div>
        <div class="item-content" v-if="propData.extraPosition == 'middle' && propData.contentFiled" v-html="getExpressData('data', propData.contentFiled, item)" />
      </div>
      <div class="i-docList-content-empty" v-if="!data || !data.length">
        <img
          :src="
            IDM.url.getModuleAssetsWebPath(require('../assets/default-empty.png'), moduleObject)
          "
        />
        <div v-if="propData.emptyDesc" class="desc">{{propData.emptyDesc}}</div>
      </div>
    </div>
  </div>
</template>

<script>
const devResult = () => {
  const arr = [];
  for(let i=0;i<10;i++){
    arr.push({
      title: '公司基本管理制度',
      content: '公司的管理制度有助于维护工作秩序，提高工作效率。经过一定的程序严格制定相应的制度，是公司管理的依据和准则。公司管理制度大体上可以分为规章和责任制度。规章制度侧重于工作内容、范围和工作程序、方式，如管理细则、行政管理制度、生产经营管理制度。责任制度侧重于规范责任、职权和利益的界限及其关系。一套科学完整的公司管理制度可以保证企业的正常运转和职工的合法利益不受侵害一套科学完整的公司管理制度可以保证企业的正常运转和职工的合法利益不受侵害……',
      publishDate: '2022-09-22 14:34',
      viewTimes: '509',
      praiseTimes: '18',
      commentTimes: '4',
      isPublished: true
    })
  }
  arr[1].update = 1
  return arr;
}
export default {
  name: 'IDocList',
  data() {
    return {
      moduleObject: {},
      moduleHeight: 0,
      propData: this.$root.propData.compositeAttr || {
        emptyDesc: '暂无数据',
        extraPosition: "middle",
        titleFiled: "title",
        contentFiled: "content",
        titleTagName: "有更新",
        imageField: 'image',
        titleTagCompareField: 'update',
        titleTagCompareValue: '1',
        extraList: [{
          textFiled: '发布时间：@[publishDate]',
          key: 'publishDate',
          position: 'left',
          compareField: 'isPublished'
        },{
          textFiled: 'viewTimes',
          key: 'viewTimes',
          position: 'left'
        },{
          textFiled: 'praiseTimes',
          key: 'praiseTimes',
          position: 'right'
        },{
          textFiled: 'commentTimes',
          key: 'commentTimes',
          position: 'right'
        }]
      },
      data: [],
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
    this.resizeContentWrapperHeight();
    if (this.moduleObject.env !== 'production') {
      this.data = devResult()
    }
  },
  methods: {
    convertAttrToStyleObject() {
      this.convertOutAttrToStyleObject();
      this.convertItemAttrToStyleObject();
      this.convertExtraItemAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
    },
    onItemClick(item, index) {
      if (this.moduleObject.env !== 'production') {
        return;
      }
      this.customFunctionHandle(this.propData.handleClickCustomFunction, {
        item,
        index,
        data: this.data,
        _this: this
      });
    },
    onExtraClick(extra, item, index) {
      if (this.moduleObject.env !== 'production') {
        return;
      }
      if (extra.clickType == 'dataSource' && extra.dataSource && extra.dataSource[0]?.id) {
        IDM.datasource.request(extra.dataSource[0]?.id, {
          moduleObject: this.moduleObject,
          param: {
            item,
          }
        }, (data) => {
          if (extra.callbackType == 'compareChange' && extra.compareField) {
            item[extra.compareField] = extra.compareChangeValue || !item[extra.compareField]
            this.$set(this.data, index, item)
          } else if (extra.callbackType == 'customFunction') {
            this.customFunctionHandle(extra.callbackCustomFunction, {
              item,
              index,
              data: this.data,
              resData: data,
              _this: this
            });
          }
        })
      } else if (extra.clickType == 'customFunction') {
        this.customFunctionHandle(extra.handleClickCustomFunction, {
          item,
          index,
          data: this.data,
          _this: this
        });
      }
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
      this.resizeContentWrapperHeight();
    },
    resizeContentWrapperHeight(wrapperHeight, wrapperWidth) {
      wrapperHeight = wrapperHeight || $('#' + this.moduleObject.packageid)
      .parents('.fsl-region-element')
      .height();
      wrapperWidth = wrapperWidth || $('#' + this.moduleObject.packageid)
      .parents('.fsl-region-element')
      .width();
      let moduleTBMarginNumber = 0;
      const iAttrArray = ['marginTopVal', 'marginBottomVal'];
      iAttrArray.forEach(item => {
        if (this.propData.box && this.propData.box[item]) {
          if (this.propData.box[item].indexOf('%') > -1) {
            //用宽度计算出实际的px
            moduleTBMarginNumber =
              moduleTBMarginNumber +
              (parseFloat(this.propData.box[item].replace('%', '')) / 100) * wrapperWidth;
          } else {
            moduleTBMarginNumber =
              moduleTBMarginNumber + parseFloat(this.propData.box[item].replace('px', ''));
          }
        }
      });
      this.moduleHeight = wrapperHeight - moduleTBMarginNumber;
    },
    /**
     * 组件通信：接收消息的方法
     */
    receiveBroadcastMessage(messageObject) {
      switch (messageObject.type) {
        case 'regionResize':
          if (messageObject.message && messageObject.message.gridEleTarget) {
            const {offsetHeight, offsetWidth} = messageObject.message.gridEleTarget
            this.resizeContentWrapperHeight(offsetHeight, offsetWidth);
          }
          break;
        case 'linkageResult':
          if (messageObject.message) {
            let data = this.propData.dataFiled ? this.getExpressData('data', this.propData.dataFiled, messageObject.message) : messageObject.message;
            this.data = this.customFormat(this.propData.dataCustomFunction, data);
          }
          break;
      }
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      let _defaultVal = undefined;
      if (dataFiled) {
        let filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths('[') ? '' : '.') + filedExp;
        let dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject, false);
      }
      return _defaultVal;
    },
    customFormat(customFunction, data) {
      if (customFunction && customFunction[0] && customFunction[0].name) {
        data =
          window[customFunction[0].name] &&
          window[customFunction[0].name].call(this, {
            commonParam: this.commonParam(),
            customParam: customFunction[0].param,
            data
          });
      }
      return data;
    },
    customFunctionHandle(customFunction, param = {}) {
      if (customFunction && customFunction[0] && customFunction[0].name) {
        return window[customFunction[0].name] &&
          window[customFunction[0].name].call(this, {
            commonParam: this.commonParam(),
            customParam: customFunction[0].param,
            ...param
          });
      }
    },
    commonParam() {
      return {
        moduleObject: this.moduleObject,
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : '',
        urlObject: IDM.url.queryObject()
      };
    },
    /**
     * 把属性转换成样式对象
     */
    convertOutAttrToStyleObject() {
      const styleObject = {};
      const emptyStyleObject = {};
      const emptyFontStyleObject = {};
      const emptyImgStyleObject = {};

      if (this.propData.bgSize && this.propData.bgSize == 'custom') {
        styleObject['background-size'] =
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.bgSize) {
        styleObject['background-size'] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'width':
            case 'height':
              styleObject[key] = element;
              break;
            case 'bgColor':
              styleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'bgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'bgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'bgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
            case 'border':
              IDM.style.setBorderStyle(styleObject, element);
              break;
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'box':
              IDM.style.setBoxStyle(styleObject, element);
              break;
            case 'emptyHeight':
              emptyStyleObject['height'] = element;
              break;
            case 'emptyImgSize':
              emptyImgStyleObject['height'] = element + 'px';
              emptyImgStyleObject['width'] = element + 'px';
              break;
            case 'emptyFont':
              IDM.style.setFontStyle(emptyFontStyleObject, element);
              break;
            case 'emptyFontMargin':
              emptyFontStyleObject['margin-top'] = element + 'px';
              break;
          }
        }
      }

      window.IDM.setStyleToPageHead(this.moduleObject.packageid + ' #' + this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-empty',
        emptyStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-empty .desc',
        emptyFontStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-empty img',
        emptyImgStyleObject
      );
    },
    convertItemAttrToStyleObject() {
      const styleObject = {};
      const titleStyleObject = {};
      const contentStyleObject = {};
      const extraStyleObject = {};
      const titleFontStyleObject = {};
      const titleTagStyleObject = {};
      const titleImgStyleObject = {};

      if (this.propData.itemBgSize && this.propData.itemBgSize == 'custom') {
        styleObject['background-size'] =
          (this.propData.itemBgSizeWidth
            ? this.propData.itemBgSizeWidth.inputVal + this.propData.itemBgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.itemBgSizeHeight
            ? this.propData.itemBgSizeHeight.inputVal + this.propData.itemBgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.itemBgSize) {
        styleObject['background-size'] = this.propData.itemBgSize;
      }
      if (this.propData.itemPositionX && this.propData.itemPositionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.itemPositionX.inputVal + this.propData.itemPositionX.selectVal;
      }
      if (this.propData.itemPositionY && this.propData.itemPositionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.itemPositionY.inputVal + this.propData.itemPositionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'itemWidth':
              styleObject['width'] = element;
              break;
            case 'itemHeight':
              styleObject['height'] = element;
              break;
            case 'itemBgColor':
              styleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'itemBgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'itemBgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'itemBgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
            case 'itemBorder':
              IDM.style.setBorderStyle(styleObject, element);
              break;
            case 'itemBoxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'itemBox':
              IDM.style.setBoxStyle(styleObject, element);
              break;
            case 'itemTitleBox':
              IDM.style.setBoxStyle(titleStyleObject, element);
              break;
            case 'itemContentBox':
              IDM.style.setBoxStyle(contentStyleObject, element);
              break;
            case 'itemExtraBox':
              IDM.style.setBoxStyle(extraStyleObject, element);
              break;
            case 'itemContentFont':
              IDM.style.setFontStyle(contentStyleObject, element);
              break;
            case 'itemTitleFont':
              IDM.style.setFontStyle(titleFontStyleObject, element);
              break;
            case 'itemTitleImgSize':
              titleImgStyleObject['width'] = element + 'px';
              titleImgStyleObject['height'] = element + 'px';
              break;
            case 'itemTitleTagFont':
              IDM.style.setFontStyle(titleTagStyleObject, element);
              titleTagStyleObject['border-color'] = element.fontColors.hex8 ? IDM.hex8ToRgbaString(element.fontColors.hex8) : '';
              break;
            case 'itemTitleTagMargin':
              titleTagStyleObject['margin-left'] = element + 'px';
              break;
            case 'itemTitleImgMargin':
              titleImgStyleObject['margin-right'] = element + 'px';
              break;
          }
        }
      }

      window.IDM.setStyleToPageHead(this.moduleObject.packageid + ' #' + this.moduleObject.id + ' .i-docList-content .i-docList-content-item', styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-title',
        titleStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-content',
        contentStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-extra',
        extraStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-title .title',
        titleFontStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-title .img',
        titleImgStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-title .tag',
        titleTagStyleObject
      );
    },
    convertExtraItemAttrToStyleObject() {
      const extraList = this.propData.extraList;
      if (!extraList) {
        return;
      }
      for (var i = 0; i < extraList.length; i++) {
        const extra = extraList[i];
        if (!(extra.key)) {
          continue;
        }
        const itemStyleObject = {};
        const iconStyleObject = {};
        const textStyleObject = {};
        for (const key in extra) {
          if (extra.hasOwnProperty.call(extra, key)) {
            const element = extra[key];
            if (!element && element !== false && element != 0) {
              continue;
            }
            switch (key) {
              case 'box':
                IDM.style.setBoxStyle(itemStyleObject, element);
                break;
              case 'iconSize':
                iconStyleObject['font-size'] = element + 'px';
                break;
              case 'iconColor':
                iconStyleObject['color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
                break;
              case 'iconMargin':
                iconStyleObject['margin-right'] = element + 'px';
                break;
              case 'extrafont':
                IDM.style.setFontStyle(textStyleObject, element);
                break;
            }
          }
        }
        window.IDM.setStyleToPageHead(
          this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-docList-content .i-docList-content-item .item-extra .item-${extra.key}`,
          itemStyleObject
        );
        window.IDM.setStyleToPageHead(
          this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-docList-content .i-docList-content-item .item-extra .item-${extra.key} .icon`,
          iconStyleObject
        );
        window.IDM.setStyleToPageHead(
          this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-docList-content .i-docList-content-item .item-extra .item-${extra.key} .text`,
          textStyleObject
        );
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
        IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
          ? IDM.setting.applications.themeNamePrefix
          : 'idm-theme-';
      for (var i = 0; i < themeList.length; i++) {
        const item = themeList[i];

        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' + this.moduleObject.id + ' .i-docList-content .i-docList-content-item .item-extra .item .text',
          {
            color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
          }
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' + this.moduleObject.id + ' .i-docList-content .i-docList-content-item .item-extra .item .icon',
          {
            color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
          }
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' + this.moduleObject.id + ' .i-docList-content .i-docList-content-item .item-title .tag',
          {
            color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
            'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
          }
        );
      }
    }
  }
};
</script>

<style lang="scss">
.i-docList-outer {
  width: auto;
  height: auto;
  box-sizing: border-box;
  padding: 0 10px;
  margin: 0 10px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
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

  .i-docList-content {
    .i-docList-content-item {
      border-bottom: 1px solid rgba(229,229,229,1);
      padding: 20px 0;
      .item-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .img{
          width: 22px;
          height: 22px;
          margin-right: 5px;
        }
        .title{
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          line-height: 22px;
          font-weight: 500;
        }
        .tag {
          font-size: 12px;
          line-height: 18px;
          color: #0079FF;
          border: 1px solid rgba(0,145,255,1);
          border-radius: 2px;
          padding: 0 5px;
          margin-left: 10px;
        }
      }
      .item-content {
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        line-height: 22px;
        font-weight: 400;
        text-indent: 2em;
        margin-top: 5px;
      }
      .item-extra {
        overflow: hidden;
        .item {
          display: inline-block;
          margin: 0 15px;
          .icon {
            display: inline-block;
            font-size: 14px;
            color: #999999;
            margin-right: 5px;
            .idm_filed_svg_icon {
              font-size: 1em;
              width: 1em;
              height: 1em;
              fill: currentColor;
              vertical-align: -0.15em;
              outline: none;
            }
          }
          .text {
            display: inline-block;
            font-size: 14px;
            color: #999999;
            letter-spacing: 0;
            line-height: 22px;
            font-weight: 400;
          }
        }
      }
    }

    .i-docList-content-empty {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 150px;
        height: 150px;
      }
      .desc {
        font-size: 14px;
        color: #666666;
        line-height: 22px;
        margin-top: 10px;
      }
    }
  }
}
</style>
