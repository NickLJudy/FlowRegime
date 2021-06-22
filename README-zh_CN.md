# 关于 flowRegime状态管理组件

## 功能
使用`hooks+context`的形式实现对项目状态管理的组件

## 如何使用
本组件共暴露俩个API

### StateWrapper
* 包裹你的应用组件顶层
  ```js
  ReactDOM.render(
    <React.StrictMode>
      <StateWrapper>
        <App />
      </StateWrapper>
    </React.StrictMode>,
    document.getElementById('root')
  )
  ```

### ctrlState
* 使用逻辑和`useState`相似
  ```js
  const [state,dispatch] = ctrlState(stateSign,initState);
  
  //eq:
  const  [multiCount,setMultiCount]= ctrlState(`MULTI-SIGN-${val}`); //独立context形式
  const  [count,setCount]= ctrlState(`COUNT`,{num:1}); //共享context形式
  ```
  * 相同之处
    * 返回的数组第一个item是定义的 `state`
      * 默认返回`undefined`
    * 返回的数组第二个item是设置该state的`dispatch`方法
    * 只能在函数最外层调用 `ctrlState`。不要在循环、条件判断或者子函数中调用。
      * 因为其内部使用了hook
  * 不同之处
    * ctrlState声明的state在项目全局（`StateWrapper`组件包裹之下）可用
    * ctrlState接收的第一个参数是该声明的标识
      * 可以是任何类型,不过建议使用`string`或`symbol`类型作为标识
    * ctrlState接收的第二个参数是state初始值
    * 每个不同标识下
      * `state`相互独立，互不影响
      * `dispatch`方法也只针对相同标识下的state进行变更
    * 设置前缀为`MULTI-`的字符串标识会享有单独的 `context`
      * 无论是单独还是共享的`context`都只是组件内部实现，俩者在使用表现上完全一致。
      * 提供独立的context是出于对`性能优化`方面的考量，使用者可根据个人意愿自由决定需不需要独立的context。
        * 个人建议，如果同一标识声明下需要同步的state>10，使用独立的context，其他情况使用共享的context即可
          * 题外话：由个人测试表现来看，独立的context实际效果好于共享context。

## 其他
* 我们在使用setState或useState更新state的时候，可能会因为疏忽等原因，直接在state对象上进行操作，然后将其传入更新方法中，比如
    ```js
    let [m,setM] = useState({a:1});
    // other code...

    m.a = 2;
    setM(m); //error writing

    ```
  这么写会产生的问题：
  * dispatch传入的参数可能是在state基础上修改的，内存地址相同，react内部使用 `Object.is` 判断，是无法进行有效更新的。
  * 为杜绝这种隐性错误的发生，本组件在state更新过程（`reducer`函数内）中，会检测新旧state内存地址是否相同，相同则抛出错误。
* 出于性能优化考虑，新旧state内存地址不同，但数据一致，组件不会进行渲染。

## 参考链接
* https://github.com/facebook/react/issues/15156#issuecomment-474590693