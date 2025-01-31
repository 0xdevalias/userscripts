// reactHelpers.js
// https://github.com/0xdevalias/userscripts/tree/main/devtools-snippets
//
// See also:
//   - https://gist.github.com/search?q=user:0xdevalias+react
//   - https://gist.github.com/0xdevalias/8c621c5d09d780b1d321bfdb86d67cdd#react-internals

// Function to get find all elements connected to React
function findAllReactElements(customPredicate = () => true, rootNode = document, tagQuery = '*') {
  if (typeof customPredicate !== 'function') throw 'customPredicate must be a function returning a boolean'
  if (typeof rootNode?.['querySelector'] !== 'function') return [];

  const foundElements = rootNode.getElementsByTagName(tagQuery);
  return Array.from(foundElements).filter(element => {
    const keys = Object.getOwnPropertyNames(element);
    const reactPropsKey = keys.find(key => key.startsWith('__reactProps$'));
    const reactFiberKey = keys.find(key => key.startsWith('__reactFiber$'));
    const props = reactPropsKey ? element[reactPropsKey] : null;
    const fiber = reactFiberKey ? element[reactFiberKey] : null;

    return (props || fiber) && customPredicate({ props, fiber, element });
  });
}

// Function to get React props for a given HTML element
function getReactProps(element) {
  const propsKey = Object.getOwnPropertyNames(element).find(propName =>
    propName.startsWith('__reactProps$')
  );
  return propsKey ? element[propsKey] : null;
}

// Function to get React fiber for a given HTML element
function getReactFiber(element) {
  const fiberKey = Object.getOwnPropertyNames(element).find(propName =>
    propName.startsWith('__reactFiber$')
  );
  return fiberKey ? element[fiberKey] : null;
}
