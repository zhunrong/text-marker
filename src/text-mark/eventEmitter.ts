export interface IListener {
  (event?: any): void
}

export interface IEvents {
  [eventName: string]: IListener[]
}
export class EventEmitter {
  readonly events: IEvents = {}
  /**
   * 监听事件
   * @param eventName 
   * @param listener 
   */
  on(eventName: string, listener: IListener) {
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(listener)
  }
  /**
   * 移除监听回调
   * @param eventName 
   * @param listener 
   */
  off(eventName: string, listener: IListener) {
    if (!this.events[eventName]) return
    const index = this.events[eventName].findIndex(item => item === listener)
    this.events[eventName].splice(index, 1)
  }
  /**
   * 激发事件
   * @param eventName 
   * @param params 
   */
  emit(eventName: string, params?: any) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(listener => {
        listener(params)
      })
    }
  }

  /**
   * 清除所有事件
   */
  clear() {
    Object.keys(this.events).forEach(key => {
      delete this.events[key]
    })
  }
}

export default EventEmitter