import _TextMarker from "./TextMarker.vue";
import { PluginObject, Component } from "vue/types";

type TextMarker = Component & PluginObject<void>;

(_TextMarker as TextMarker).install = function (Vue) {
  Vue.component("week-time-picker", _TextMarker);
};

export default _TextMarker as TextMarker;