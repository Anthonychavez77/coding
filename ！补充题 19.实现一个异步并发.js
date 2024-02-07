/**

异步并发任务控制器的概念和作用
在js中，异步编程是一种常见的编程方式，它可以让程序在等待某些操作（如网络请求、文件读写、定时器等）的结果时，不阻塞主线程，而继续执行其他代码。
这样可以提高程序的性能和用户体验。 但是，如果有多个异步操作同时进行，就需要考虑它们之间的协调和管理问题。
例如： - 如何避免过多的异步操作占用系统资源，导致内存溢出或者网络拥堵？ 
- 如何保证异步操作的执行顺序或者优先级？ 
- 如何处理异步操作的成功或者失败结果？ 
为了解决这些问题，我们可以使用一种叫做**异步并发任务控制器**。它可以让我们将一系列返回promise对象的函数（也就是异步任务）添加到一个队列中，
并根据设定的最大并发数（也就是同时进行的异步任务数量），按照先进先出（FIFO）的原则，依次执行队列中的任务，并处理它们返回的promise对象。

这样做有以下几个好处： 
- 可以限制同时进行的异步任务数量，避免资源浪费或者竞争。
 - 可以保证队列中先添加的任务先执行，后添加的任务后执行。 
 - 可以统一处理所有任务返回的promise对象，并根据成功或者失败做相应操作。

 */


//接下来，我们来看看如何用js实现一个简单的异步并发任务控制器。首先，我们需要定义一个类来表示控制器对象，并在构造函数中初始化以下三个属性：
//`maxConcurrent`：最大并发数，也就是同时进行的异步任务数量。
//`currentConcurrent`：当前并发数，也就是正在进行中或者已经完成但还未从队列中移除的异步任务数量。
//`taskQueue`：任务队列，用一个数组来存储待执行或者正在执行中的返回promise对象函数。

// 定义一个异步任务控制器类
class AsyncTaskController {
  // 构造函数，接受最大并发数作为参数
  constructor(maxConcurrent) {
    // 初始化最大并发数
    this.maxConcurrent = maxConcurrent
    // 初始化当前并发数
    this.currentConcurrent = 0
    // 初始化任务队列
    this.taskQueue = []
  }

  // 添加一个异步任务到队列中，接受一个返回promise的函数作为参数
  addTask(task) {
    // 将任务函数加入队列
    this.taskQueue.push(task)
    // 尝试执行下一个任务
    this.next()
  }

  // 执行下一个任务，如果当前并发数小于最大并发数，并且队列不为空，则从队列中取出一个任务并执行，否则什么都不做
  next() {
    if (this.currentConcurrent < this.maxConcurrent && this.taskQueue.length > 0) {
      // 取出队列中的第一个任务函数，并从队列中移除它
      const task = this.taskQueue.shift()
      // 增加当前并发数
      this.currentConcurrent++
      // 执行任务函数，并处理其返回的promise对象
      task()
        .then((result) => {
          // 如果成功，打印结果（或者做其他操作）
          console.log(result)
        })
        .catch((error) => {
          // 如果失败，打印错误（或者做其他操作）
          console.error(error)
        })
        .finally(() => {
          // 不管成功还是失败，都要减少当前并发数，并执行下一个任务（递归调用）
          this.currentConcurrent--
          this.next()
        })
    }
  }
}

// 测试代码

// 创建一个异步任务控制器实例，最大并发数为2
const controller = new AsyncTaskController(2)

// 定义一些返回promise的函数作为模拟的异步任务

// 模拟成功的异步任务，接受一个id作为参数，返回一个延迟1秒后resolve的promise对象，值为id * 2
const successTask = (id) => () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(id * 2), 1000)
  })

// 模拟失败的异步任务，接受一个id作为参数，返回一个延迟1秒后reject的promise对象，值为id * -1
const failTask = (id) => () =>
  new Promise((_, reject) => {
    setTimeout(() => reject(id * -1), 1000)
  })

// 添加一些异步任务到控制器中

controller.addTask(successTask(1))
controller.addTask(failTask(2))
controller.addTask(successTask(3))
controller.addTask(failTask(4))
controller.addTask(successTask(5))

// 预期输出：
// -1 （第二个失败的异步任务先完成）
// -4 （第四个失败的异步任务后完成）
// 2 （第一个成功的异步任务后完成）
// 6 （第三个成功的异步任务后完成）
//10 （第五个成功的异步任务最后完成）


function scheduler(max) {
  // ------你的代码
}

const addRequest = scheduler(2);

const request1 = () => {
  return new Promise((rs) => {
    setTimeout(() => {
      rs(1)
    }, 500)
  })
}

const request2 = () => {
  return new Promise((rs) => {
    setTimeout(() => {
      rs(2)
    }, 800)
  })
}

const request3 = () => {
  return new Promise((rs) => {
    setTimeout(() => {
      rs(3)
    }, 1000)
  })
}

const request4 = () => {
  return new Promise((rs) => {
    setTimeout(() => {
      rs(4)
    }, 1200)
  })
}

addRequest(request1).then((res) => {
  console.log(res);
})
addRequest(request2).then((res) => {
  console.log(res);
});
addRequest(request3).then((res) => {
  console.log(res);
});
addRequest(request4).then((res) => {
  console.log(res);
});

//模拟接口请求
function getData(src) {
  return new Promise((resolve,reject)=>{
    setTimeout(() => {
      resolve(src)
    }, 1000);
  })
}

/*异步并发限制*/
function limitRequest(limit) {
  this.que = []
  this.limit = limit
  this.count = 0
  //添加任务
  this.push = function(task) {
    this.que.push(task)
    this.run()
  }
  //执行任务
  this.run = function() {
    //1.如果队列非空,并且当前正在运行个数<limit
    if(this.que.length && this.count<this.limit) {
      let task = this.que.shift()
      this.count++
      task.fn(task.src).then(msg=>{
        console.log(msg)
        this.count--
        this.run()
      })
    }
  }
}


//测试使用
let p = new limitRequest(2)//一次性最多执行2个任务
p.push({fn:getData,src:1})
p.push({fn:getData,src:1})
p.push({fn:getData,src:1})
p.push({fn:getData,src:1})
