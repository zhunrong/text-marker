import component from "./TextMarker.vue";
import { PluginObject } from "vue/types";

type TextMarker = typeof component & PluginObject<void>;

const plugin = component as TextMarker;

plugin.install = function (Vue) {
  Vue.component(component.name, component);
};

plugin.version = process.env.VUE_APP_VERSION;

export default plugin;
