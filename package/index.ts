import component from './TextMarker.vue';
import { PluginObject } from "vue";

type ComponentType = typeof component & PluginObject<void>;

const plugin = component as ComponentType;

plugin.install = function (Vue) {
  Vue.component("text-marker", component);
};

plugin.version = process.env.VERSION!;

export default plugin;