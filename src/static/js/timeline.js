const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_TIME = Symbol('pause-time')
const PAUSE_START = Symbol('pause-start')
export class Timeline {
    constructor(){
        this[ANIMATIONS] = new Set()
        this[START_TIME] = new Map()
        this[PAUSE_TIME] = 0
        this.state = 'inited'
    }
    //动画队列开始执行
    start(){
        if (this.state !== 'inited')
            return
        this.state = 'started'
        let startTime = Date.now()
        this[TICK] = () => {
            console.log(1)
            for (let animation of this[ANIMATIONS]){
                let t = Date.now()

                if(startTime < this[START_TIME].get(animation)) {
                    t = t - this[START_TIME].get(animation) - animation.delay - this[PAUSE_TIME]
                } else {
                    t = t - startTime - animation.delay - this[PAUSE_TIME]
                }
                if (animation.duraiton < t) {
                    this[ANIMATIONS].delete(animation)
                    //防止t的值超出animation.duraiton
                    t = animation.duraiton
                }
                if (t > 0) {
                    animation.receive(t)
                }
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
        }
        this[TICK]()
    }
    //暂停动画
    pause(){
        if (this.state !== 'started')
            return
        this.state = 'pause'
        this[PAUSE_START] = Date.now()
        cancelAnimationFrame(this[TICK_HANDLER])
    }
    //恢复动画
    resume(){
        if (this.state !== 'pause')
            return
        this.state = 'started'
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
        this[TICK]()
    }
    //添加动画
    add(animation, startTime){
        if (arguments.length < 2) {
            startTime = Date.now()
        }
        this[ANIMATIONS].add(animation)
        this[START_TIME].set(animation, startTime)
    }
    //重置动画
    reset(){
        this.pause()
        this.state = 'inited'
        this[TICK_HANDLER] = null
        this[PAUSE_START] = 0
        this[ANIMATIONS] = new Set()
        this[START_TIME] = new Map()
        this[PAUSE_TIME] = 0
    }
}

export class Animation{
    constructor(obj, property, startValue, endValue, duraiton, delay, timingfunc,template){
        
        template = template || (v => v)
        timingfunc = timingfunc || (v => v)

        //元素对象
        this.obj = obj
        //要改变的属性名称
        this.property = property
        //属性初始值
        this.startValue = startValue
        //属性结束值
        this.endValue = endValue
        //动画持续时间
        this.duraiton = duraiton
        //动画是否延迟
        this.delay = delay
        //过度效果
        this.timingfunc = timingfunc
        //处理一些属性值需要带px的情况
        this.template = template
    }

    //在某个时间点对属性值做相应的变化
    receive(time){
        let range = this.endValue - this.startValue
        //tf: 0-1
        let tf = this.timingfunc(time / this.duraiton)
        this.obj[this.property] = this.template(this.startValue + range * tf)
    }
}