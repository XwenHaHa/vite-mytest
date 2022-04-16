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
    const leftList = ref<{ img: string; value: string }[]>([]);
    const rightList = ref<{ img: string; value: string }[]>([]);
    const leftEl = ref<InstanceType<typeof HTMLElement>>();
    const rightEl = ref<InstanceType<typeof HTMLElement>>();
    const formEl = ref<InstanceType<typeof ElForm>>();

    // 定义队列
    const queue = new Queue(list);
    const queue1 = new ImgQueue(leftList, rightList, leftEl, rightEl);

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
    const onScroll = debounce((e: Event) => {
      const target = e.target as HTMLElement;
      scrollTop.value = target.scrollTop;
    }, 100);
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
      while (num < 100000) {
        list.value.push(...addData(count));
        num++;
      }
    };

    // 多次添加数据队列版
    const handleQuequ = (count: number) => {
      while (num < 10000) {
        queue.enqueue(addData(count));
        num++;
      }
    };
    // 等图片load完再添加节点
    const handleImg = (count: number) => {
      const data: any = [];
      let i = 0;
      while (i < count) {
        const src = `images/${i + 1}.jpg`;
        data.push(src);
        i++;
      }
      queue1.enqueue(data);
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
      leftList.value.forEach((v, i) => {
        arr2.push(
          <div class="imgli" key={i}>
            <el-form-item style={{ margin: 0 }}>
              <img src={v.img} />
              <span>{v.value}</span>
            </el-form-item>
          </div>
        );
      });
      return arr2;
    });
    const renderList3 = computed(() => {
      const arr3: JSX.Element[] = [];
      rightList.value.forEach((v, i) => {
        arr3.push(
          <div class="imgli" key={i}>
            <el-form-item>
              <img src={v.img} />
              <span>{v.value}</span>
            </el-form-item>
          </div>
        );
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
      renderList1,
      renderList2,
      renderList3,
      rules,
      itemHeight,
      leftEl,
      rightEl,
      formEl,
      list,
      leftList,
      rightList,
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
          <button onClick={() => this.handleOrdinary(10)}>
            新增10行数据10000次普通
          </button>
          <button onClick={() => this.handleQuequ(10)}>
            新增10行数据10000次队列
          </button>
          <button onClick={() => this.handleImg(10)}>新增10张图片</button>
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
            <div class="left" ref="leftEl">
              {this.renderList2}
            </div>
            <div class="right" ref="rightEl">
              {this.renderList3}
            </div>
          </div>
          <div class="rightul">
            <div class="left" ref="leftEl">
              {this.renderList2}
            </div>
            <div class="right" ref="rightEl">
              {this.renderList3}
            </div>
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
  .rightul{
    position: absolute!important;
    right: 200px;
    top: 90px;
  }
  .rightul,
  .ul {
    .left {
      float: left;
    }
    .right {
      float: left;
    }
    .imgli {
      width: 200px;
      height: auto;
      padding: 10px;
      font-size: 14px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      margin-right: 10px;
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
    width: 450px;
    height: 500px;
    overflow-y: scroll;
    position: relative;
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
