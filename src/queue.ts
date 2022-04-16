import { Ref } from "vue";
export class Queue<T> {
  private list: any[] = [];
  private arr: Ref<any[]>;
  constructor(list: Ref<any[]>) {
    this.arr = list;
  }

  /** 入队 */
  enqueue(element: any[]) {
    this.list.push(...element);
    this.createTime();
  }
  private timer:any = null
  createTime() {
      if (this.timer) return;
      this.timer = setInterval(() => {
        this.arr.value.push(...this.list.splice(0, 100));
        if(!this.list.length){
          clearInterval(this.timer)
          this.timer = null;
        }
      }, 100);
  }
}