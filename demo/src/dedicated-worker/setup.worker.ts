/* eslint-env worker */
import Box2D from 'box2d-wasm';
import { setupGame } from './game';
(async () => {
  const box2D = await Box2D({
    locateFile(path: string, scriptDirectory: string): string {
      /**
       * `path` will be something like:
       * 'Box2D.wasm'
       * scriptDirectory was an empty string in my case.
       * 
       * `self.location.href` will be something like this:
       * 'blob:http://localhost:5000/ac7840e4-e4b4-4ccc-a12a-66d3a2f90b46'
       * 
       * Extract the origin,
       * 'http://localhost:5000'
       * new URL(self.location.href).origin
       * 
       * Compose a URL
       * 'http://localhost:5000/Box2D.wasm'
       */
      return new URL(`${scriptDirectory}${path}`, new URL(self.location.href).origin).toString();
    }
  });
  setupGame(box2D);
})();
self.addEventListener('message', e => {
  console.log(e);
});
export {};