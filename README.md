# FlowRegime

FlowRegime is a component that uses `hooks+context` for state management with React.

English | [简体中文](./README-zh_CN.md) 


<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="80" height="20" role="img" aria-label="npm: v1.1.0"><title>npm: v1.1.0</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="80" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="35" height="20" fill="#555"/><rect x="35" width="45" height="20" fill="#007ec6"/><rect width="80" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="185" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">npm</text><text x="185" y="140" transform="scale(.1)" fill="#fff" textLength="250">npm</text><text aria-hidden="true" x="565" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="350">v1.1.0</text><text x="565" y="140" transform="scale(.1)" fill="#fff" textLength="350">v1.1.0</text></g></svg>

## Installation

The FlowRegime package lives in [npm](https://www.npmjs.com/get-npm). To install the latest stable version, run the following command:

```shell
npm i flowregime
```

Or if you're using [yarn](https://classic.yarnpkg.com/en/docs/install/):

```shell
yarn add flowregime
```

## Introduction
Expose two APIs.

### StateWrapper
* Wrap the top layer of your application.
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
* The logic is similar to `useState`.
  ```js
  const [state,dispatch] = ctrlState(stateSign,initState);
  
  //eq:
  const  [multiCount,setMultiCount]= ctrlState(`MULTI-SIGN-${val}`); //independent context
  const  [count,setCount]= ctrlState(`COUNT`,{num:1}); //shared context
  ```
  * Similarities
    * The first item of the array returned is the defined `state`.
      * Default value：`undefined`.
    * The second item of the array returned is the `dispatch` method that sets the state.
    * `ctrlState` can only be called on the outermost layer of a function. Do not call in loops, conditionals, or subfunctions.
      * Because it uses a hook internally.
  * Differences
    * The state declared by ctrlState is available globally (under the `StateWrapper` component).
    * The first parameter that `ctrlState` receives is the identity of the declaration.
      * This can be any type, but it is recommended to use the `string` or `symbol` type as the identifier.
    * The second parameter that ctrlState receives is the initial value of state.
    * Under each different identifier.
      * `state` is independent of each other and does not influence each other.
      * The `dispatch` method also changes only for states under the same identity.
    * String identifiers prefixed with `MULTI-` will have a separate `context`.
      * The `context`, whether it is a single or shared one, is only an internal implementation of the component, and is used in exactly the same way.
      * Separate contexts are provided for 'performance optimization' purposes, and users are free to decide whether they need separate contexts or not.
        * I recommend that if you need to synchronize `state>10` under the same identity declaration, use a separate context, otherwise use a shared context.
          * As an aside: independent contexts actually work better than shared contexts based on individual test performance.

## NOTICE
* When we use setState or useState to update the state, we may inadvertently operate directly on the state object and then pass it into the update method, for example:
    ```js
    let [m,setM] = useState({a:1});
    // other code...

    m.a = 2;
    setM(m); //error writing

    ```
  The problem with writing this way:
  * Dispatch passes parameters that may be modified based on state, and the memory address is the same, so it can't be effectively updated by react using `object.is` internal judgment.
  * In order to avoid such implicit errors, FlowRegime will detect whether the old and new state memory addresses are the same in the state update process (`reducer`  function), and throw an error if the same.
  * For performance optimization, the old and new state memory addresses are different, but the data is the same, and FlowRegime is not rendered.

## License
FlowRegime is [MIT licensed](./LICENSE).