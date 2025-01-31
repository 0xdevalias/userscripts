// Next.js v13+ - Extract Chunk URLs.js
// https://github.com/0xdevalias/userscripts/tree/main/devtools-snippets
//
// See also:
//   - https://gist.github.com/search?q=user:0xdevalias+webpack
//   - https://gist.github.com/0xdevalias/ac465fb2f7e6fded183c2a4273d21e61#react-server-components-nextjs-v13-and-webpack-notes-on-streaming-wire-format-__next_f-etc

const parseJSONFromEntry = entry => {
  const jsonPart = entry.substring(entry.indexOf('[') + 1, entry.lastIndexOf(']'));
  try {
    return JSON.parse(`[${jsonPart}]`);
  } catch (e) {
    console.error("Failed to parse JSON for entry: ", entry);
    return [];  // Return an empty array or null as per error handling choice
  }
};

// Function to transform dependencies into a simpler, directly accessible format
function transformDependencies(dependencies) {
  return Object.values(dependencies).reduce((acc, currentDeps) => {
    Object.entries(currentDeps).forEach(([moduleId, path]) => {
      // If the paths match, skip to the next entry
      if (acc?.[moduleId] === path) return

      if (!acc[moduleId]) {
        // If this module ID has not been encountered yet, initialize it with the current path
        acc[moduleId] = path;
      } else if (typeof acc[moduleId] === 'string' && acc[moduleId] !== path) {
        // If the current path for this module ID is different from the existing one,
        // and the existing one is a string, transform it into an array containing both paths.
        const oldPath = acc[moduleId];
        acc[moduleId] = [oldPath, path];
      } else if (Array.isArray(acc[moduleId]) && !acc[moduleId].includes(path)) {
        // If the existing entry for this module ID is an array and does not already include the current path,
        // add the current path to the array.
        acc[moduleId].push(path);
      } else {
        // Log any unhandled cases for further investigation. This could be used to catch any unexpected data structures or duplicates.
        console.error('Unhandled case', { acc, currentDeps, moduleId, path });
      }
    });
    return acc;
  }, {});
}

// Get _next script urls
const scriptTags = document.querySelectorAll('html script[src*="_next"]');
const scriptUrls = Array.from(scriptTags).map(tag => tag.src).sort()
// console.log(scriptUrls);

// Get imports/etc (v3)
const moduleDependencies =
  self.__next_f
    .map(f => f?.[1])
    .filter(f => f?.includes('static/'))
    .flatMap(f => f.split('\n'))
    .map(parseJSONFromEntry)
    .filter(f => Array.isArray(f) ? f.length > 0 : !!f)
    .map(f => {
      if (!Array.isArray(f?.[1])) { return f } else {
        // Convert alternating key/value array to an object
        const keyValueArray = f[1];
        const keyValuePairs = [];
        for (let i = 0; i < keyValueArray.length; i += 2) {
          keyValuePairs.push([keyValueArray[i], keyValueArray[i + 1]]);
        }
        f[1] = Object.fromEntries(keyValuePairs);
        return f;
      }
    })
    .filter(f => Array.isArray(f) && f.length === 3 && typeof f?.[1] === 'object')
    .reduce((acc, [moduleId, dependencies, _]) => {
      acc[moduleId] = dependencies;
      return acc;
    }, {});

const chunkMappings = transformDependencies(moduleDependencies)

const uniqueChunkPaths = Array.from(new Set(Object.values(chunkMappings))).sort()

const dynamicChunkUrls = uniqueChunkPaths
  .map(path => `https://www.udio.com/_next/${path}`)
  .sort()

const chunkUrls = Array.from(new Set([...scriptUrls, ...dynamicChunkUrls])).sort()

const chunkUrlsJoined = chunkUrls.join('\n')

const buildId = self.__next_f
  .map(f => f?.[1])
  .filter(f => f?.includes('buildId'))
  .flatMap(f => f.trim().split('\n'))
  .flatMap(parseJSONFromEntry)
  .map(f => Array.isArray(f) ? f.flat() : f)
  .map(f => f?.[3]?.buildId)
  .filter(Boolean)?.[0]

const chunkUrlsJoinedWithBuildId = `${chunkUrlsJoined}\n${buildId}`

console.log({
  scriptUrls,
  moduleDependencies,
  chunkMappings,
  uniqueChunkPaths,
  dynamicChunkUrls,
  chunkUrls,
  buildId,
})
console.log(chunkUrlsJoinedWithBuildId)
copy(chunkUrlsJoinedWithBuildId)
console.log('Chunk URLs (joined) + BuildID copied to clipboard')
