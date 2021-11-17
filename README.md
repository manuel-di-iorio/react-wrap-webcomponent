# React Wrap Web Component

Wrap a Web Component (Custom Element) into a React Component, in order to pass attributes, custom events and arbitrary complex data, like objects or arrays, when using props.

---

### Install

```
$ npm install manuel-di-iorio/react-wrap-webcomponent
```

---

### Example

```jsx
import React from "react";
import { wrapWebComponent } from 'react-wrap-webcomponent';

class MyComponent extends HTMLElement {};
customElements.define('my-component', MyComponent);

const MyComponentWrapped = wrapWebComponent("my-component");

function App() {
  return (
    <MyComponentWrapped myobject={{ hello: "world" }} trackmyobj="true" mycustomevent={() => console.log("trigger")} />
  );
}
```
---

### Docs

Objects and arrays to the custom element will be available on the custom element 'data' property.

Example:

```js
class MyComponent extends HTMLElement {
  static get observedAttributes() {
    return ["trackmyobj"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(this.data) // Prints -> `{ hello: "world" }
  }
}
```

---

Custom functions in the props can be triggered via the standard event dispatch API

Example: 

```js
const event = new Event("mycustomevent") // Only lowercase events
this.dispatchEvent(event)
```

---

### License

MIT
