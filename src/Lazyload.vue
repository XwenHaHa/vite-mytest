<template>
  <div>
    <div class="masonry">
      <ul :ref="setRef">
        <li v-for="(item, index) in list" :key="index">
          <img :src="item.img" @load="ifLoad" />
          <span>{{ item.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import list from "./list.json";

export default defineComponent({
  name: "Lazyload",
  setup() {
    const testVal = ref(0);
    const test = () => {
      testVal.value += 1;
      console.log(myRef.value.length);
    };
    const myRef: any = ref([]);
    let loadcount = 0;
    const setRef = (el: any) => {
      myRef.value.push(el.children);
    };
    const array: any = [];
    const ifLoad = () => {
      setTimeout(() => {
        loadcount += 1;
        if (loadcount === list.length) {
          getWaterfall();
        }
      }, 3000);
    };
    // 渲染瀑布流
    const getWaterfall = () => {
      let columns = 2;
      let item = myRef.value[0];
      for (let i = 0; i < item.length; i++) {
        //遍历整个子元素的DOM集合
        if (i < columns) {
          //小于columns的子元素作为第一行
          item[i].style.top = 20 + "px";
          item[i].style.left = item[0].clientWidth * i + "px";
          //遍历结束时，数组this.array保存的是第一行子元素的元素高度
          loadcount++;
          array.push(item[i].clientHeight);
        } else {
          //大于等于columns的子元素将作其他行
          //  找到第一列的最小高度
          let minHeight = Math.min(...array);
          // 找到最小高度的索引
          let index = array.findIndex((item: number) => item === minHeight);
          //设置当前子元素项的位置
          item[i].style.top = array[index] + 25 + "px";
          item[i].style.left = item[index].offsetLeft + "px";
          loadcount++;
          //重新定义数组最小项的高度 进行累加
          array[index] += item[i].clientHeight;
        }
      }
    };
    return {
      test,
      testVal,
      list,
      setRef,
      getWaterfall,
      ifLoad,
    };
  },
});
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}
.masonry {
  width: 750px;
  height: 100vh;
  color: #333;
  text-align: center;
  font-size: 20px;
  position: relative;
  ul {
    height: 100%;
    list-style: none;
    box-sizing: border-box;
    background-color: #fff;
    overflow: hidden;
    li {
      width: 200px;
      height: auto;
      padding: 10px;
      font-size: 14px;
      position: absolute;
      box-sizing: border-box;
      border: 1px solid #ccc;
      margin: 0 0 10px 0;
      overflow: hidden;
      img {
        width: 100%;
        display: block;
        height: auto;
      }
      span {
        line-height: 2;
        margin-left: 10px;
      }
    }
  }
}
</style>
