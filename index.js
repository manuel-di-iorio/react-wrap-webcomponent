import React, { useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * Wrap a Web Component into a React Component
 * @author Manuel Di Iorio
 * 
 * @param {String} webComponentId Custom element ID
 * @param {Object} settings Settings
 * @param {Boolean} [settings.layoutEffect=false] If to use a layout effect hook (useful to avoid UI flickering but it runs synchronously)
 * @param {Boolean} [settings.autoSetAttrForComplexData=true] If to automatically set a special attribute, when passing objects/arrays (useful to track these changes)
 * @param {String} [settings.autoSetAttrPrefix="_"] The prefix used in the special attribute name (cannot be empty)
 *
 * @return {Function} React Component
 */
export const wrapWebComponent = (webComponentId, settings = {}) => {
  const useEffectHook = settings.layoutEffect ? useLayoutEffect : useEffect;
  const autoSetAttrForComplexData = settings.autoSetAttrForComplexData !== false;
  const autoSetAttrPrefix = settings.autoSetAttrPrefix || "_";

  // Return a React wrapper component
  return (props) => {
    let node;
    const handlers = {};
    const cache = {};
    const attrs = {
      // Find the custom element node reference
      ref: (reactComponent) => {
        const foundNode = ReactDOM.findDOMNode(reactComponent);
        if (foundNode) node = foundNode;
      }
    };

    // Get the updated data and events from the props
    const getUpdatedProps = (useCache = false) => {
      if (node && !node.data) node.data = {};

      for (const key in props) {
        const propValue = props[key];

        // Avoid to handle unchanged props
        if (useCache) {
          const cachedPropValue = cache[key];
          cache[key] = propValue;
          if (propValue === cachedPropValue) continue;
        }

        switch (typeof propValue) {
          case "function":
            // Sync the custom events handlers
            if (node) {
              node.addEventListener(key, propValue);
              handlers[key] = propValue;
            }
            break;

          case "array":
          case "object":
            // Store arbitrary data into the node for later retrieval
            if (node) {
              node.data[key] = propValue;

              if (autoSetAttrForComplexData) {
                const specialKey = autoSetAttrPrefix + key;
                node.setAttribute(specialKey, !node.getAttribute(specialKey));
              }
            }
            break;

          default:
            // Set the updated attributes
            if (node) {
              node.setAttribute(key, propValue);
            } else {
              attrs[key] = propValue;
            }
        }
      }
    };

    // Update the node based on the props
    getUpdatedProps();

    useEffectHook(() => {
      getUpdatedProps(true);

      // Cleanup the handlers on component unmount
      return () => {
        if (!node) return;
        for (const event in handlers) {
          node.removeEventListener(event, handlers[event]);
        }
      };
    }, Object.keys(props));

    // Create the Reactified custom element with the initial props and children
    return React.createElement(webComponentId, attrs, props.children);
  }
}
