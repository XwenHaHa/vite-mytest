<script lang="tsx">
import { defineComponent, ref, computed } from "vue";
import { ElInput, ElForm, ElFormItem } from "element-plus";
import { RuleItem } from "async-validator";
import { ImgQueue } from "./imgqueue";
import { Queue } from "./queue";

export default defineComponent({
  name: "Home",
  components: {
    ElInput,
    ElForm,
    ElFormItem,
  },
  setup() {
    // 数据列表项
    const list = ref<{ name: string; sub: string }[]>([]);
    const scrollTop = ref(0);
    const itemHeight = 50;
    const screenHeight = 300;
    let num = 0;

    // 图片列表项
    const leftList = ref<{ img: string; value: number; height: number }[]>([]);
    const rightList = ref<{ img: string; value: number; height: number }[]>([]);
    const renderList = ref<{ img: string; value: number }[]>([]);
    const leftEl = ref<InstanceType<typeof HTMLElement>>();
    const rightEl = ref<InstanceType<typeof HTMLElement>>();
    const preEl = ref<InstanceType<typeof HTMLElement>>();
    const formEl = ref<InstanceType<typeof ElForm>>();

    // 定义队列
    const queue = new Queue(list);
    const queue1 = new ImgQueue(renderList);
    // 封装防抖函数
    const debounce = <T extends (...args: any[]) => unknown>(
      cb: T,
      duration: number = 300
    ) => {
      let timer: any = null;
      return (...args: Parameters<T>) => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => cb(...args), duration);
      };
    };
    // 滚动事件
    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      scrollTop.value = target.scrollTop;
      console.log(111);
    };
    // 新增文本数据
    const addData = (count: number) => {
      let i = 0;
      const data = [];
      while (i < count) {
        data.push({
          name: `${Date.now()}_${Math.random()}`,
          sub: "副标题",
        });
        i++;
      }
      return data;
    };
    // 用队列添加数据
    const handleLoadMore = (count: number) => {
      queue.enqueue(addData(count));
    };
    // 多次添加数据普通版
    const handleOrdinary = (count: number) => {
      while (num < count) {
        list.value.push(...addData(10));
        num++;
      }
    };
    // 多次添加数据队列版
    const handleQuequ = (count: number) => {
      while (num < count) {
        queue.enqueue(addData(10));
        num++;
      }
    };
    const addImg = (count: number) => {
      const data: any = [];
      let i = 0;
      while (i < count) {
        const src = `images/${i + 1}.jpg`;
        data.push(src);
        i++;
        if (i == 10) {
          i = 0;
          count -= 10;
        }
      }
      queue1.enqueue(data);
      return data;
    };
    // 等图片load完再添加节点
    const handleImg = (count: number) => {
      addImg(count);
    };
    // 多次添加图片队列
    const validate = async () => {
      console.time();
      try {
        await formEl.value?.validate();
      } catch (error) {
        console.log("err");
      }
      console.timeEnd();
    };
    let count = 0;
    let totalLeft = ref(0);
    let totalRight = ref(0);
    // 预渲染图片加载事件
    const preloadImage = () => {
      count++;
      if (count == renderList.value.length) {
        renderList.value.forEach((v, i) => {
          const height = preEl.value!.children[i]!.clientHeight;
          if (totalRight.value >= totalLeft.value) {
            leftList.value.push({
              ...v,
              height,
            });
            totalLeft.value += height;
          } else {
            rightList.value.push({
              ...v,
              height,
            });
            totalRight.value += height;
          }
        });
        renderList.value = [];
        count = 0;
      }
    };
    const prenderList = computed(() => {
      return renderList.value.map((v, i) => {
        return (
          <div class="imgli" key={i}>
            <img src={v.img} onLoad={() => preloadImage()} />
          </div>
        );
      });
    });
    const renderList1 = computed(() => {
      const arr1: JSX.Element[] = [];
      list.value.forEach((v, i) => {
        if (i * itemHeight < scrollTop.value - screenHeight) {
        } else if (i * itemHeight > scrollTop.value + 2 * screenHeight) {
        } else {
          arr1.push(
            <div
              class="li"
              key={i}
              style={{
                top: `${i * itemHeight}px`,
              }}
            >
              <el-form-item
                label="label"
                prop={`data[${i}].name`}
                rules={rules}
              >
                <el-input v-model={v.name} />
              </el-form-item>
            </div>
          );
        }
      });
      return arr1;
    });
    const renderList2 = computed(() => {
      const arr2: JSX.Element[] = [];
      let preHeight = 0;
      leftList.value.forEach((v, i) => {
        if (preHeight < scrollTop.value - screenHeight) {
        } else if (preHeight > scrollTop.value + 2 * screenHeight) {
        } else {
          arr2.push(
            <div class="imgli" key={i} style={{ top: `${preHeight}px` }}>
              <img src={v.img} style={{ height: `${v.height}px` }} />
            </div>
          );
        }
        preHeight += v.height;
      });
      return arr2;
    });
    const renderList3 = computed(() => {
      const arr3: JSX.Element[] = [];
      let preHeight = 0;
      rightList.value.forEach((v, i) => {
        if (preHeight < scrollTop.value - screenHeight) {
        } else if (preHeight > scrollTop.value + 2 * screenHeight) {
        } else {
          arr3.push(
            <div class="imgli" key={i} style={{ top: `${preHeight}px` }}>
              <img src={v.img} style={{ height: `${v.height}px` }} />
            </div>
          );
        }
        preHeight += v.height;
      });
      return arr3;
    });
    const rules: RuleItem[] = [
      {
        validator: (_rules, _value, cb) => {
          cb("1231");
        },
      },
    ];
    return {
      prenderList,
      renderList,
      renderList1,
      renderList2,
      renderList3,
      rules,
      itemHeight,
      leftEl,
      rightEl,
      preEl,
      formEl,
      list,
      leftList,
      rightList,
      totalLeft,
      totalRight,
      handleLoadMore,
      handleOrdinary,
      handleQuequ,
      handleImg,
      validate,
      onScroll,
    };
  },
  render() {
    return (
      <div class="box">
        <div class="btn">
          <button onClick={() => this.handleLoadMore(10)}>新增10行数据</button>
          <button onClick={() => this.handleLoadMore(100)}>
            新增100行数据
          </button>
          <button onClick={() => this.handleLoadMore(1000)}>
            新增1000行数据
          </button>
          <button onClick={this.validate}>校验</button>
          <button onClick={() => this.handleOrdinary(10000)}>
            新增10行数据10000次普通
          </button>
          <button onClick={() => this.handleQuequ(10000)}>
            新增10行数据10000次队列
          </button>
          <button onClick={() => this.handleImg(10)}>新增10张图片</button>
          <button onClick={() => this.handleImg(1000)}>新增1000张图片</button>
          <button onClick={() => this.handleImg(4)}>新增4张图片</button>
        </div>
        <el-form
          label-position="left"
          label-width="100px"
          status-icon={true}
          model={{
            data: this.list,
          }}
          ref="formEl"
        >
          <div class="ul" onScroll={this.onScroll}>
            <div
              style={{
                height: `${this.list.length * this.itemHeight}px`,
              }}
            >
              {this.renderList1}
            </div>
            <div
              class="left"
              ref="leftEl"
              style={{
                height: `${this.totalLeft}px`,
              }}
            >
              {this.renderList2}
            </div>
            <div
              class="right"
              ref="rightEl"
              style={{
                height: `${this.totalRight}px`,
              }}
            >
              {this.renderList3}
            </div>
          </div>
          <div class="rightul">
            <div ref="preEl">{this.prenderList}</div>
          </div>
        </el-form>
      </div>
    );
  },
});
</script>
<style lang="less">
.box {
  .btn {
    width: 400px;
    display: flex;
    flex-wrap: wrap;
    button {
      margin: 0 5px 5px 0;
    }
  }
  .rightul {
    position: absolute !important;
    right: 200px;
    top: -8000px;
  }
  .rightul,
  .ul {
    width: 450px;
    height: 500px;
    overflow-y: scroll;
    position: relative;
    .left {
      float: left;
      width: 200px;
      position: relative;
    }
    .right {
      float: left;
      width: 200px;
      position: relative;
    }
    .imgli {
      position: absolute;
      left: 0;
      width: 200px;
      height: auto;
      font-size: 14px;
      box-sizing: border-box;
      background-color: #f0f0f0;
      overflow: hidden;
      .el-form-item__content {
        margin-left: 0 !important;
      }
      img {
        width: 100%;
        display: block;
        height: auto;
      }
      span {
        display: block;
        width: 100%;
        text-align: center;
      }
    }
    .li {
      position: absolute;
      left: 0;
      width: 100%;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
      margin-right: 10px;
      padding: 5px;
      height: 50px;
      box-sizing: border-box;
    }
  }
}
</style>
