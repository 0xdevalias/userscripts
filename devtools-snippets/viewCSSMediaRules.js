// Script Version 1

// const stylesheets = Array.from(document.styleSheets);
// const breakpoints = new Set();

// for (const stylesheet of stylesheets) {
//   try {
//     for (const rule of stylesheet.cssRules) {
//       if (rule instanceof CSSMediaRule && rule.media.mediaText) {
//         const mediaText = rule.media.mediaText;
//         const matches = mediaText.matchAll(/(\(min-width:\s*(\d+)(px|em|rem)\))|(\(max-width:\s*(\d+)(px|em|rem)\))/g);
//         for (const match of matches) {
//           const breakpointValue = match[2] || match[5];
//           const breakpointUnit = match[3] || match[6];
//           breakpoints.add(`${breakpointValue}${breakpointUnit}`);
//         }
//       }
//     }
//   } catch (error) {
//     // Ignore CORS errors for external stylesheets
//     if (!(error instanceof DOMException && error.name === 'SecurityError')) {
//       console.error('Error accessing stylesheet:', error);
//     }
//   }
// }

// // Convert the Set to an Array and sort numerically
// const cssMediaBreakpointsV1 = Array.from(breakpoints).sort((a, b) => {
//   const [valueA, unitA] = a.match(/^(\d+)([a-z%]+)$/).slice(1);
//   const [valueB, unitB] = b.match(/^(\d+)([a-z%]+)$/).slice(1);

//   // Compare numerical values, keeping units in case of identical values
//   return Number(valueA) - Number(valueB) || unitA.localeCompare(unitB);
// });

// const stylesheets = Array.from(document.styleSheets);
// const cssMediaBreakpointsV1 = [];

// for (const stylesheet of stylesheets) {
//   try {
//     for (const rule of stylesheet.cssRules) {
//       if (rule instanceof CSSMediaRule && rule.media.mediaText) {
//         const mediaText = rule.media.mediaText;
//         const matches = mediaText.matchAll(/\((min|max)-(width|height):\s*(\d+)(px|em|rem)\)/g);
//         const breakpoints = [];

//         for (const match of matches) {
//           breakpoints.push({
//             type: match[1], // 'min' or 'max'
//             dimension: match[2], // 'width' or 'height'
//             value: parseInt(match[3], 10), // Numeric value
//             unit: match[4], // Unit ('px', 'em', or 'rem')
//             fullMediaText: mediaText // Full media query text
//           });
//         }

//         if (breakpoints.length > 0) {
//           cssMediaBreakpointsV1.push({
//             fullMediaText: mediaText,
//             breakpoints
//           });
//         }
//       }
//     }
//   } catch (error) {
//     // Ignore CORS errors for external stylesheets
//     if (!(error instanceof DOMException && error.name === 'SecurityError')) {
//       console.error('Error accessing stylesheet:', error);
//     }
//   }
// }

// Script Version 2

// const cssMediaBreakpointsV2 = [
//   ...new Set(
//     [...document.styleSheets]
//       .filter(sheet => {
//         try {
//           return sheet.cssRules; // Check if cssRules can be accessed
//         } catch (e) {
//           return false;
//         }
//       })
//       .flatMap(sheet => [...sheet.cssRules])
//       .filter(rule => rule.type === CSSRule.MEDIA_RULE) // Ensure it's a media rule
//       .flatMap(rule => {
//         const matches = rule.media.mediaText.matchAll(/(min|max)-width:\s*(\d+)(px|em|rem)/g);
//         return [...matches].map(match => ({
//           type: match[1], // 'min' or 'max'
//           value: parseInt(match[2], 10), // Numeric value
//           unit: match[3], // Unit ('px', 'em', or 'rem')
//           fullMediaText: rule.media.mediaText // Full media query text
//         }));
//       })
//   )
// ];

const cssMediaBreakpointsV2 = [
  ...new Set(
    [...document.styleSheets]
      .filter(sheet => {
        try {
          return sheet.cssRules; // Check if cssRules can be accessed
        } catch (e) {
          return false;
        }
      })
      .flatMap(sheet => [...sheet.cssRules])
      .filter(rule => rule.type === CSSRule.MEDIA_RULE) // Ensure it's a media rule
      .map(rule => {
        const mediaText = rule.media.mediaText;
        const matches = mediaText.matchAll(/\((min|max)-(width|height):\s*(\d+)(px|em|rem)\)/g);
        const breakpoints = [];

        for (const match of matches) {
          breakpoints.push({
            type: match[1], // 'min' or 'max'
            dimension: match[2], // 'width' or 'height'
            value: parseInt(match[3], 10), // Numeric value
            unit: match[4] // Unit ('px', 'em', or 'rem')
          });
        }

        return {
          fullMediaText: mediaText,
          breakpoints
        };
      })
  )
];

// Output

console.log(`Screen Dimensions: ${window.screen.width}x${window.screen.height}`);
console.log(`Window Dimensions: ${window.innerWidth}x${window.innerHeight}`);
console.log(`Window Position: (${window.screenX}, ${window.screenY})`);
console.log(
  'CSS Media Breakpoints',
  // {
    // cssMediaBreakpointsV1,
    cssMediaBreakpointsV2
  // }
);

// Checks

// const currentWidth = window.innerWidth;
// const currentHeight = window.innerHeight;

// const threshold = 5; // Margin around breakpoints

// const problematicBreakpointsV2 = cssMediaBreakpointsV2.filter(bp => {
//   if (bp.unit === 'px') {
//     if (bp.type === 'max') {
//       return currentWidth <= bp.value + threshold || currentHeight <= bp.value + threshold;
//     } else if (bp.type === 'min') {
//       return currentWidth >= bp.value - threshold || currentHeight >= bp.value - threshold;
//     }
//   }
//   return false;
// });

// if (problematicBreakpointsV2.length > 0) {
//   console.log('Potential issues with breakpoints:', problematicBreakpointsV2);
// } else {
//   console.log('No breakpoint issues detected.');
// }

const currentWidth = window.innerWidth;
const currentHeight = window.innerHeight;

const threshold = 5; // Margin around breakpoints

const problematicBreakpoints = cssMediaBreakpointsV2.filter(bp =>
  bp.breakpoints.some(br => {
    if (br.unit === 'px') {
      const isClose = (
        (br.dimension === 'width' && Math.abs(currentWidth - br.value) <= threshold) ||
        (br.dimension === 'height' && Math.abs(currentHeight - br.value) <= threshold)
      );
      return isClose;
    }
    return false;
  })
);

if (problematicBreakpoints.length > 0) {
  // console.log('Potential issues with breakpoints:', problematicBreakpoints.map(bp => bp.fullMediaText));
  console.log('Potential issues with breakpoints:', problematicBreakpoints);
} else {
  console.log('No breakpoint issues detected.');
}

