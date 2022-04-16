import { Ref } from "vue";
export class ImgQueue<T> {
  private list: any[] = [];
  preRenderList: Ref<any[]>;
  constructor(
    preRenderList: Ref<any[]>
  ) {
    this.preRenderList = preRenderList;
  }

  /** 入队 */
  enqueue(element: any[]) {
    this.list.push(...element);
    this.createTime();
  }

  private timer: any = null;
  createTime() {
    if (this.timer) return;
    setInterval(() => {
      if (this.preRenderList.value.length !== 0) return;
      if (this.list.length === 0) {
        clearInterval(this.timer);
        this.timer = null;
        return;
      }
      const data = this.list.splice(0, 10);
      data.map((v) =>
        this.preRenderList.value.push({
          img: v,
          value: parseInt(v.replace(/[^0-9]/ig,"")),
        })
      );
    }, 100)
  }
  // loader(src: string) {
  //   return new Promise(async (resolve) => {
  //     const img = new Image();
  //     img.src = src;
  //     img.onload = () => {
  //       resolve(true);
  //     };
  //   });
  // }
  // appendEl(src: string) {
  //   return new Promise(async (resolve) => {
  //     const leftH = this.leftEl.value?.clientHeight || 0;
  //     const rightH = this.rightEl.value?.clientHeight || 0;
  //     if (rightH >= leftH) {
  //       this.leftList.value.push({
  //         img: src,
  //         value: parseInt(src.replace(/[^0-9]/ig,"")),
  //       });
  //     } else {
  //       this.rightList.value.push({
  //         img: src,
  //         value: parseInt(src.replace(/[^0-9]/ig,"")),
  //       });
  //     }
  //     await nextTick();
  //     resolve(true);
  //   });
  // }
}
