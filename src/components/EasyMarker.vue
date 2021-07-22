<template>
  <div class="hello">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, saepe!
    Saepe, soluta aliquam, expedita deserunt hic vitae aperiam eos consequuntur
    accusamus eligendi atque labore. At in dolorum est exercitationem dolore.
  </div>
</template>

<script lang="js">
import { Component, Prop, Vue } from "vue-property-decorator";
import EasyMarker from "easy-marker";

@Component
export default class HelloWorld extends Vue {

  async mounted() {
    await this.$nextTick();

    const em = new EasyMarker({
      menuTopOffset: "2rem",
      scrollSpeedLevel: 6,
      scrollOffsetBottom: "1.5rem",
      menuItems: [
        {
          text: "划线笔记",
          id: 1,
          iconName: "iconfont icon-mark",
        },
        {
          text: "分享",
          style: {
            backgroundColor: "#407ff2",
            paddingLeft: "0.5rem",
          },
          id: 2,
          iconName: "iconfont icon-share",
        },
        {
          text: "复制",
          id: 3,
          iconName: "iconfont icon-copy",
        },
      ],
      // Not required
      markdownOptions: {
        H1: (text) => `\n# ${text}\n\n`,
        H2: (text) => `\n## ${text}\n\n`,
        H3: (text) => `\n### ${text}\n\n`,
        H4: (text) => `\n#### ${text}\n\n`,
        H5: (text) => `\n##### ${text}\n\n`,
        H6: (text) => `\n###### ${text}\n\n`,
        P: (text) => `${text}\n\n`,
        FIGCAPTION: (text) => `${text}\n\n`,
        STRONG: (text) => `**${text}**`,
        B: (text) => `**${text}**`,
        EM: (text) => `*${text}*`,
        I: (text) => `*${text}*`,
        S: (text) => `~~${text}~~`,
        INS: (text) => `++${text}++`,
        // IMG
        // option.alt: IMG alt
        // option.src: IMG src
        // option.width: IMG width
        // option.height: IMG height
        IMG: (option) =>
          `![${option.alt}](${option.src}?size=${option.width}x${option.height})\n`,
        // UL
        // option.listLevel: List nesting level
        UL: (text, option) => {
          if (option.listLevel > 1) {
            return `\n${text}`;
          }
          return `\n${text}\n`;
        },
        // OL
        // option.listLevel: List nesting level
        OL: (text, option) => {
          if (option.listLevel > 1) {
            return `\n${text}`;
          }
          return `\n${text}\n`;
        },
        // LI
        // option.type: parentNode nodeName,
        // option.isLastOne: Whether the last item in the list
        // option.itemLevel: List nesting level
        // option.hasChild: Is the node has child node
        // option.index: The index in the list
        LI: (text, option) => {
          let spaceString = "";
          for (let i = 1; i < option.itemLevel; i++) {
            spaceString += "    ";
          }
          let endString = "\n";
          if (option.hasChild || option.isLastOne) {
            endString = "";
          }
          if (option.type === "UL") {
            return `${spaceString}- ${text}${endString}`;
          }
          return `${spaceString}${option.index}. ${text}${endString}`;
        },
      },
    } );

    // em.create(document.querySelector(".article-body"), document.body);
    em.onMenuClick((id, data) => {
      console.log("You click the menu!");
      console.log(id, data);
    });

    em.create(this.$el, document.body);
  }
}
</script>
