# flowregime

Flowregime is a component that uses `hooks+context` for state management with React.

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/flowregime)](https://bundlephobia.com/package/flowregime)
![GitHub](https://img.shields.io/github/license/NickLJudy/flowregime)
![https://github.com/NickLJudy/flowregime/commits/main](https://img.shields.io/github/last-commit/NickLJudy/flowregime)

## Installation

The flowregime package lives in [npm](https://www.npmjs.com/get-npm). To install the latest stable version, run the following command:

```shell
npm i flowregime
```

Or if you're using [yarn](https://classic.yarnpkg.com/en/docs/install/):

```shell
yarn add flowregime
```

## Usage

There are only two APIs:

### StateWrapper

Wrap your components.

```js
<StateWrapper>
  <App />
</StateWrapper>
```

### useCtrlState

The logic is similar to `useState`.

`const [state,dispatch] = useCtrlState(stateSign,initState)`

```js
//eq:
const  [count,setCount]= useCtrlState(`MULTI-COUNT`,{num:1})
```

## License

Flowregime is [MIT licensed](./LICENSE).
