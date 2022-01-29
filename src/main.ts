import Vue from "vue";
import App from "./App.vue";
import ScrollView from "@chenzr/scroll-view";
import "@chenzr/scroll-view/libs/scroll-view.css";
import TextMarker from "./text-marker";

Vue.use(ScrollView);
Vue.use(TextMarker);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
