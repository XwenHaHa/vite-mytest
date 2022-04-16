<script lang="tsx">
import { defineComponent, onMounted, ref, computed } from "vue";
import { ElInput, ElForm, ElFormItem } from "element-plus";
import { RuleItem } from "async-validator";
// import ScrollList  from './scrollList.vue'

export default defineComponent({
  name: "Home",
  components: {
    ElInput,
    ElForm,
    ElFormItem,
  },
  setup() {
    const list = ref<{ name: string; sub: string }[]>([]);
    const scrollTop = ref(0);
    // 列表容器
    const formEl = ref<InstanceType<typeof ElForm>>();
    const onScroll = (e: any) => {
      scrollTop.value = e.target.scrollTop;
    };
    const handleLoadMore = (count: number) => {  
      let i = 0;
      let mylist = []
      while (i <= count) {
        mylist.push({
          name: `${Date.now()}_${Math.random()}`,
          sub: "副标题",
        })
        i++;
      }
      // console.log(mylist);
      list.value.push(...mylist)
    };
    const itemHeight = 50;
    const validate = async () => {
      console.time();
      try {
        await formEl.value?.validate();
      } catch (error) {
        console.log("err");
      }
      console.timeEnd();
    };
    const renderList = computed(() => {
      const screenHeight = 300;
      return list.value.map((v, i) => {
        let hidden = false;
        if (i * itemHeight < scrollTop.value - screenHeight) {
          hidden = true;
        }
        return {
          ...v,
          hidden,
        };
      });
    });
    const rules: RuleItem[] = [
      {
        validator: (_rules, _value, cb) => {
          cb("1231");
        },
      },
    ];
    return {
      renderList,
      rules,
      itemHeight,
      handleLoadMore,
      formEl,
      list,
      validate,
      onScroll,
    };
  },
  render() {
    return (
      <div>
        <button onClick={() => this.handleLoadMore(10)}>新增10行数据</button>
        <button onClick={() => this.handleLoadMore(100)}>新增100行数据</button>
        <button onClick={() => this.handleLoadMore(1000)}>
          新增1000行数据
        </button>
        <button onClick={() => this.handleLoadMore(10000)}>
          新增10000行数据
        </button>
        <button onClick={this.validate}>校验</button>
        <el-form
          label-position="left"
          label-width="100px"
          status-icon={true}
          model={{
            data: this.list,
          }}
          ref="formEl"
        >
          <div class="ul" ref="panel" onScroll={this.onScroll}>
            {this.renderList.map((v, index) => (
              <div
                class="li"
                key={index}
                style={{
                  top: `${index * this.itemHeight}px`,
                  display: v.hidden ? "none" : "block",
                }}
                ref="myRef"
              >
                <el-form-item
                  label="label"
                  prop={`data[${index}].name`}
                  rules={this.rules}
                >
                  <el-input v-model={v.name} />
                </el-form-item>
              </div>
            ))}
          </div>
        </el-form>
      </div>
    );
  },
});
</script>
<style lang="less">
.ul {
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
    margin-bottom: 10px;
    padding: 5px;
    height: 50px;
    box-sizing: border-box;
  }
}
</style>
