<script lang="typescript">
  import Box2DFactory from 'box2d-wasm';
  import type { Box2DEmscriptenModule } from 'box2d-wasm';
  import { onMount } from 'svelte';

  let memStart: number | undefined;
  let memEnd: number | undefined;
  let memDestroyBodies: number | undefined;
  let count: number | undefined;
  let items = 0;

	onMount(async () => {
    const box2D: Box2DEmscriptenModule = await Box2DFactory({
      environment: 'WEB'
    });
    const { b2BodyDef, b2Vec2, b2World, destroy, getPointer, _malloc, _free } = box2D;

    const checkMemory = (): number => {
      const ptrs: number[] = [];
      let total = 0;
      const counts: { [ix: number]: number } = {};
      let count = 0;
      let size = 1024 * 1024;

      while (size >= 1) {
        try {
          ptrs.push(_malloc(size));
          total += size;
          count++;
        } catch (e) {
          counts[size] = count;
          size >>= 1;
          count = 0;
        }
      }

      try {
        for (const ptr of ptrs) {
          _free(ptr);
        }
      } catch (e) {
        console.error(e);
      }

      for (const s in counts) {
        console.log(`${counts[s]} of size ${s}`);
      }
      return total;
    }

    interface HasPointer {
      ptr: number;
    }
    const hasPointer = <T extends Box2D.WrapperObject>(wrapper: T): wrapper is T & HasPointer => 
      typeof wrapper.ptr === 'number';

    const world = new b2World(new b2Vec2(0.0, -10.0));

    memStart = checkMemory();

    for (let i = 0; i < 100; i++) {
      const tmp = new b2BodyDef();
      destroy(tmp);
    }

    memEnd = checkMemory();

    for (let i = 0; i < 100; i++) {
      const tmp = new b2BodyDef();
      const body = world.CreateBody(tmp);
      world.DestroyBody(body);
      destroy(tmp);
    }

    memDestroyBodies = checkMemory();

    let myB2Body: Box2D.b2Body = world.GetBodyList();
    while(hasPointer(myB2Body) && getPointer(myB2Body)) {
      items++;
      myB2Body = myB2Body.GetNext();
    }

    count = world.GetBodyCount();

    return () => {};
	});
</script>

<pre>
mem start:
{memStart}

mem after body def destroy:
{memEnd}

mem after destroy bodies__:
{memDestroyBodies}

count:
{count}

items:
{items}
</pre>