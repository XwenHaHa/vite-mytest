<script lang="tsx">
import { defineComponent, ref } from "vue";
import { ElForm } from "element-plus";
import mylist from "./list.json";

export default defineComponent({
  name: "WaterFall",
  components: {
    ElForm,
  },
  setup() {
    const leftList = ref<{ img: string; value: string }[]>([]);
    const rightList = ref<{ img: string; value: string }[]>([]);
    const leftEl = ref<InstanceType<typeof HTMLDivElement>>();
    const rightEl = ref<InstanceType<typeof HTMLDivElement>>();
    let i = 1;
    const handleImg = () => {
      const img = new Image()
      const src = `images/${i}.jpg`;
      img.src = src;
      img.onload = () => {
        const leftHeight = leftEl.value?.clientHeight || 0;
        const rightHeight = rightEl.value?.clientHeight || 0;
        if (rightHeight >= leftHeight) {
          leftList.value.push({
            img: src,
            value: `第${i}张`,
          });
        } else {
          rightList.value.push({
            img: src,
            value: `第${i}张`,
          });
        }
        i++;
        if (i == mylist.length + 1) {
          i = 1;
        }
      };
    }
    return {
      leftEl,
      rightEl,
      mylist,
      leftList,
      rightList,
      handleImg,
    };
  },
  render() {
    return (
      <div>
        <button onClick={() => this.handleImg()}>新增图片</button>
        <el-form >
          <div class="ul">
            <div class="left" ref="leftEl">
              {this.leftList.map((v, index) => (
                <div
                  class="li"
                  key={index}
                >
                  <el-form-item>
                    <img src={v.img} />
                    <span>{v.value}</span>
                  </el-form-item>
                </div>
              ))}
            </div>
            <div class="right" ref="rightEl">
              {this.rightList.map((v, index) => (
                <div
                  class="li"
                  key={index}
                >
                  <el-form-item>
                    <img src={v.img} />
                    <span>{v.value}</span>
                  </el-form-item>
                </div>
              ))}
            </div>
          </div>
        </el-form>
      </div>
    );
  },
});
</script>

<style lang="less">
.ul {
  .left{
    float: left;
  }
  .right{
    float: left;
  }
  .li {
    width: 200px;
    height: auto;
    padding: 10px;
    font-size: 14px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    margin-right: 10px;
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
</style>
