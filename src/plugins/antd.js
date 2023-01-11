// 按需加载 ant-design-vue
// 手动删除没用用过的组件
import Vue from 'vue';
import 'ant-design-vue/lib/tabs/style/css';
import 'ant-design-vue/lib/empty/style/css';
import 'ant-design-vue/lib/skeleton/style/css';
import 'ant-design-vue/lib/list/style/css';
import 'ant-design-vue/lib/button/style/css';
import 'ant-design-vue/lib/spin/style/css';
import {
  Tabs,
  Empty,
  Skeleton,
  List,
  Button,
  Spin
} from 'ant-design-vue';

/* v1.1.3+ registration methods */
Vue.component('knowmanage' + Tabs.name, Tabs)
Vue.component('knowmanage' + Tabs.TabPane.name, Tabs.TabPane)
Vue.component('knowmanage' + List.name, List)
Vue.component('knowmanage' + Button.name, Button)
Vue.component('knowmanage' + Spin.name, Spin)
Vue.component(Empty.name, Empty)
Vue.component(Skeleton.name, Skeleton)