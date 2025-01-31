// webpackRuntimeInjection.js
// https://github.com/0xdevalias/userscripts/tree/main/devtools-snippets
//
// See also:
//   - https://gist.github.com/search?q=user:0xdevalias+webpack
//   - https://gist.github.com/0xdevalias/8c621c5d09d780b1d321bfdb86d67cdd#runtime-injection--overrides

/**
 * Injects wrappers into specified webpack modules to allow manipulation or stubbing.
 * @param {Object} overrides - An object where keys are module IDs and values are functions that take the old module function and return a new module function.
 */
function injectWebpackOverrides(overrides) {
  window.webpackChunk_N_E.forEach(chunk => {
    const [_, modules] = chunk;
    Object.keys(modules).forEach(moduleId => {
      if (Object.hasOwn(modules, moduleId)) {
        const originalModule = modules[moduleId];
        // Check if there is an override for the module and apply it
        if (overrides.hasOwnProperty(moduleId)) {
          // The override function receives the original module and returns a new module function
          modules[moduleId] = overrides[moduleId](originalModule);
        }
      }
    });
  });
}

/**
 * Creates a wrapped require function that can intercept module requests.
 * @param {Function} originalRequire - The original require function.
 * @param {Object} overrides - The overrides definitions.
 * @returns {Function} The wrapped require function.
 */
function createWrappedRequire(originalRequire, overrides) {
  return (moduleId) => {
    if (Object.hasOwn(overrides, moduleId)) {
      return overrides[moduleId](originalRequire(moduleId));
    }
    return originalRequire(moduleId);
  };
}

// Example usage:
// injectWebpackOverrides({
//   '51510': (oldModule) => {
//     // Create a wrapped require function directly with the specific overrides for modules this module depends on
//     const wrappedRequire = createWrappedRequire(oldModule.require, {
//       '48779': (originalModule48779) => {
//         // Modify or replace the behavior of module 48779
//         return {
//           ...originalModule48779,
//           someFunction: () => 'Modified behavior'
//         };
//       }
//     });

//     // Returns a new function that uses the wrapped require
//     return (e, t, a) => {
//       // Call the old module function using the wrappedRequire
//       return oldModule(e, t, wrappedRequire);
//     };
//   },
//   '48779': (oldModule) => {
//     // Return a completely new function, replacing the old module
//     return (e, t, a) => {
//       // Return directly whatever is needed for the shim
//       return { /* shimmed module contents */ };
//     };
//   }
// });
