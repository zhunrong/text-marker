import { PluginObject, VueConstructor } from "vue/types";

type TextMarker = VueConstructor & PluginObject<void>;

declare const marker: TextMarker;

export default marker;
