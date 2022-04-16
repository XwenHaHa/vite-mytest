<template>
  <div>
    <div
      ref="list"
      :style="{ height }"
      class="infinite-list-container"
      @scroll="scrollEvent($event)"
    >
      <div ref="phantom" class="infinite-list-phantom"></div>
      <div ref="content" class="infinite-list">
        <div
          class="infinite-list-item"
          ref="items"
          :id="item._index"
          :key="item._index"
          v-for="item in visibleData"
        >
          <slot ref="slot" :item="item.item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed } from "@vue/reactivity";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    //所有列表数据
    listData: {
      type: Array,
      default: () => [],
    },
    //预估高度
    estimatedItemSize: {
      type: Number,
      required: true,
    },
    //容器高度 100px or 50vh
    height: {
      type: String,
      default: "100%",
    },
  },
  setup(){
      const listData = computed(()=>{
          return listData.map((item:any,index:number)=>{
              return {
                  _index: `_${index}`,
                  item,
              }
          })
      })
      return {
          listData
      }
  }
});
</script>
