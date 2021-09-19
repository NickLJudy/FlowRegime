# 关于 flowRegime状态管理组件

使用`hooks+context`的形式实现对项目状态管理的组件

## 如何使用
本组件仅有俩个API

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

### useCtrlState
* 使用逻辑和`useState`相似
  ```js
  const [state,dispatch] = useCtrlState(stateSign,initState);
  
  //eq:
  const  [multiCount,setMultiCount]= useCtrlState(`MULTI-SIGN-${val}`); //独立context形式
  const  [count,setCount]= useCtrlState(`COUNT`,{num:1}); //共享context形式
  ```
  * 相同之处
    * 返回的数组第一个item是定义的 `state`
      * 默认返回`undefined`
      * 注意：默认的state不会与后续通过dispatch更新的state合并。
    * 返回的数组第二个item是设置该state的`dispatch`方法
    * 只能在函数最外层调用 `useCtrlState`。不要在循环、条件判断或者子函数中调用。
      * 因为其内部使用了hook
  * 不同之处
    * useCtrlState声明的state在项目全局（`StateWrapper`组件包裹之下）可用
    * useCtrlState接收的第一个参数是该声明的标识
      * 请使用`string`类型作为标识
    * useCtrlState接收的第二个参数是state初始值
    * 每个不同标识下
      * `state`相互独立，互不影响
      * `dispatch`方法也只针对相同标识下的state进行变更
    * 设置前缀为`MULTI-`的字符串标识会享有单独的 `context`
      * 无论是单独还是共享的`context`都只是组件内部实现，俩者在使用表现上完全一致。
      * 提供独立的context是出于对`性能优化`方面的考量，使用者可根据个人意愿自由决定需不需要独立的context。
        * 个人建议，如果同一标识声明下需要同步的state>10，使用独立的context，其他情况使用共享的context即可
          * 题外话：由个人测试表现来看，独立的context实际效果好于共享context。

## 参考链接
* https://github.com/facebook/react/issues/15156#issuecomment-474590693