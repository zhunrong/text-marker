import component from "./TextMarker.vue";
import { PluginObject } from "vue/types";

type TextMarker = typeof component & PluginObject<void>;

const plugin = component as TextMarker;

plugin.install = function (Vue) {
  Vue.component(component.name, component);
};

export default plugin;
