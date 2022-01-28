import { PluginObject, VueConstructor } from "vue";

type TextMarker = VueConstructor & PluginObject<void>;

declare const marker: TextMarker;

export default marker;
