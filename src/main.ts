import Vue from "vue";
import App from "./App.vue";
import ScrollView from "@chenzr/scroll-view";
import "@chenzr/scroll-view/libs/scroll-view.css";

Vue.use(ScrollView);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
