import Vue from 'vue';
import App from './App.vue';
import plugin from '@package';
import ScrollView from '@chenzr/scroll-view';
import '@chenzr/scroll-view/libs/scroll-view.css';

Vue.use(plugin);
Vue.use(ScrollView);

new Vue({
  render: h => h(App)
}).$mount('#app');
