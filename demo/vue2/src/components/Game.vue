<script lang="ts">
import GameSync from './GameSync.vue'
import { defineAsyncComponent } from '@vue/runtime-dom';
import Box2DFactory from 'box2d-wasm';
const box2DPromise = Box2DFactory({
  // this is no different from the default, but I've exposed it in case you have different serving
  // requirements and need to customize it
  locateFile: (url, scriptDirectory) => `${scriptDirectory}${url}`
});

export default defineAsyncComponent(async () => {
  const box2D = await box2DPromise;
  return GameSync
})
</script>

<style scoped></style>