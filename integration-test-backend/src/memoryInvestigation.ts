// note: this is only gonna work if Box2D is compiled using ALLOW_MEMORY_GROWTH=0
import Box2DFactory from 'box2d-wasm'
import { heapMeasurer, HeapTracker, HeapRemaining } from './measureHeap'
import { assertFloatEqual } from './assertFloatEqual'
import assert from 'assert'
import { getHeapStatistics } from 'v8'

const box2d: typeof Box2D & EmscriptenModule = await Box2DFactory({
  printErr: (str: string) => {
    if (str !== 'OOM') {
      console.warn(str)
    }
  }
})
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World, _malloc, _free, destroy } = box2d
const hasPointer = (obj: unknown): obj is Box2D.HasPointer =>
  typeof (obj as { Su?: number }).Su === 'number'
const getPointer = (box2d as typeof Box2D & EmscriptenModule & { getPointer: (ptr: Box2D.HasPointer) => number }).getPointer

const measureModuleHeap: HeapRemaining = heapMeasurer(_malloc, _free)
// const measureV8Heap: HeapRemaining = (): number => {
//   global.gc()
//   return getHeapStatistics().used_heap_size
// }
const tracker = new HeapTracker(measureModuleHeap)
// const tracker = new HeapTracker(measureV8Heap)

tracker.track('initialised')
const gravPoint: Box2D.Point = {
  x: 0,
  y: 10
}
const gravity = new b2Vec2(gravPoint.x, gravPoint.y)
tracker.track('allocated gravity')
const world = new b2World(gravity)
tracker.track('allocated world')
destroy(gravity)
tracker.track('freed gravity')

const sideLengthMetres = 1
const square = new b2PolygonShape()
tracker.track('allocated polygonShape')
square.SetAsBox(sideLengthMetres / 2, sideLengthMetres / 2)
tracker.track('square.SetAsBox')

const zero = new b2Vec2(0, 0)
tracker.track('allocated zero vec')

const bd = new b2BodyDef()
tracker.track('allocated body def')
bd.set_type(b2_dynamicBody)
bd.set_position(zero)

const timeStepMillis = 1 / 60
const velocityIterations = 1
const positionIterations = 1
const floatCompareTolerance = 0.01

{
  const body = world.CreateBody(bd)
  tracker.track('world.CreateBody')
  body.CreateFixture(square, 1)
  tracker.track('body.CreateFixture')
  body.SetTransform(zero, 0)
  body.SetLinearVelocity(zero)
  body.SetAwake(true)
  body.SetEnabled(true)

  const iterations = 2
  for (let i = 0; i < iterations; i++) {
    const timeElapsedMillis = timeStepMillis * i
    {
      const { y } = body.GetLinearVelocity()
      assertFloatEqual(y, gravPoint.y * timeElapsedMillis, floatCompareTolerance)
    }
    {
      const { y } = body.GetPosition()
      assertFloatEqual(y, 0.5 * gravPoint.y * timeElapsedMillis ** 2, floatCompareTolerance)
    }
    world.Step(timeStepMillis, velocityIterations, positionIterations)
    tracker.track(`world.Step iteration ${i}`)
  }
  // console.log(`👍 Ran ${iterations} iterations of a falling body. Body had the expected position on each iteration.`)

  world.DestroyBody(body)
  tracker.track('world.DestroyBody')
}
{
  const body = world.CreateBody(bd)
  tracker.track('world.CreateBody')
  body.CreateFixture(square, 1)
  tracker.track('body.CreateFixture')
  const { y } = body.GetPosition()
  console.log(y)
  // body.SetTransform(zero, 0)
  // body.SetLinearVelocity(zero)
  // body.SetAwake(true)
  // body.SetEnabled(true)

  // const iterations = 2
  // for (let i = 0; i < iterations; i++) {
  //   const timeElapsedMillis = timeStepMillis * i
  //   {
  //     const { y } = body.GetLinearVelocity()
  //     assertFloatEqual(y, gravPoint.y * timeElapsedMillis, floatCompareTolerance)
  //   }
  //   {
  //     const { y } = body.GetPosition()
  //     assertFloatEqual(y, 0.5 * gravPoint.y * timeElapsedMillis ** 2, floatCompareTolerance)
  //   }
  //   world.Step(timeStepMillis, velocityIterations, positionIterations)
  //   tracker.track(`world.Step iteration ${i}`)
  // }
  // // console.log(`👍 Ran ${iterations} iterations of a falling body. Body had the expected position on each iteration.`)

  world.DestroyBody(body)
  tracker.track('world.DestroyBody')
}
destroy(zero)
tracker.track('freed zero vec')
destroy(bd)
tracker.track('freed bodyDef')
destroy(square)
tracker.track('freed polygonShape')
