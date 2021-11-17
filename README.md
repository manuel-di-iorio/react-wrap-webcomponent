# React Wrap Web Component

Wrap a Web Component (Custom Element) into a React Component, in order to pass attributes, custom events and arbitrary complex data, like objects or arrays, when using props.

---

### Install

```
$ npm install react-wrap-webcomponent
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

Objects and arrays to pass to the web component will be available on the element 'data' property.

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

Custom functions in the props can be triggered via the event dispatch API

https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events

Example: 

```js
// Only trigger the event
this.dispatchEvent(new Event("mycustomevent"))

// Or trigger with custom data
this.dispatchEvent(new CustomEvent('mycustomevent', { customdata: "yes" });

function eventHandler(e) {
  console.log('Has custom data: ' + e.customdata);
}
```

---

### License

MIT
