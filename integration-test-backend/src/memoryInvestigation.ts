// note: this is only gonna work if Box2D is compiled using ALLOW_MEMORY_GROWTH=0
import Box2DFactory from 'box2d-wasm'
import { heapMeasurer, HeapTracker, HeapRemaining } from './measureHeap'
import { assertFloatEqual } from './assertFloatEqual'

const box2d: typeof Box2D & EmscriptenModule = await Box2DFactory({
  printErr: (str: string) => {
    if (str !== 'OOM') {
      console.warn(str)
    }
  }
})
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World, _malloc, _free, destroy } = box2d

const measureHeap: HeapRemaining = heapMeasurer(_malloc, _free)
const tracker = new HeapTracker(measureHeap)

tracker.track('initialised')
const gravity = new b2Vec2(0, 10)
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

const body = world.CreateBody(bd)
tracker.track('world.CreateBody')
body.CreateFixture(square, 1)
tracker.track('body.CreateFixture')
body.SetTransform(zero, 0)
body.SetLinearVelocity(zero)
body.SetAwake(true)
body.SetEnabled(true)
destroy(zero)
tracker.track('freed zero vec')

const timeStepMillis = 1 / 60
const velocityIterations = 1
const positionIterations = 1
const floatCompareTolerance = 0.01

const iterations = 2
for (let i = 0; i < iterations; i++) {
  const timeElapsedMillis = timeStepMillis * i
  {
    const { y } = body.GetLinearVelocity()
    assertFloatEqual(y, gravity.y * timeElapsedMillis, floatCompareTolerance)
    {
      const { y } = body.GetPosition()
      assertFloatEqual(y, 0.5 * gravity.y * timeElapsedMillis ** 2, floatCompareTolerance)
    }
  }
  world.Step(timeStepMillis, velocityIterations, positionIterations)
  tracker.track(`world.Step iteration ${0}`)
}

console.log(`👍 Ran ${iterations} iterations of a falling body. Body had the expected position on each iteration.`)
