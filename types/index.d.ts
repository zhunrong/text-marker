import { PluginObject, Component } from "vue/types";

type TextMarker = Component & PluginObject<void>;

declare const marker: TextMarker;

export default marker;
