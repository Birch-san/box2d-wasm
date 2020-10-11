/*
 * From Box2D.js
 * @see https://github.com/kripken/box2d.js/blob/02e0f2c/glue_stub.cpp
 * @author Mark Logan
 * @license Zlib https://opensource.org/licenses/Zlib
 * License evidence: https://github.com/kripken/box2d.js/blob/master/README.markdown#box2djs
 *   "box2d.js is zlib licensed, just like Box2D."
 */
#include <box2d/box2d.h>
// not sure why box2d.h doesn't include b2_rope; let's grab it manually
#include <box2d/b2_rope.h>

// import emscripten macros so that we can attempt manual binding of functions that cannot be described in WebIDL
#include <emscripten/bind.h>

using namespace emscripten;

typedef b2Shape::Type b2ShapeType;
typedef b2ContactFeature::Type b2ContactFeatureType;
typedef b2Manifold::Type b2ManifoldType;
typedef uint32 b2DrawFlag;

// Map SayGoodbye({b2Joint,b2Fixture}*) to SayGoodbye{Joint,Fixture}(..),
// so that the JS implementation can listen for both callbacks.
class b2DestructionListenerWrapper : b2DestructionListener {
public:
  virtual ~b2DestructionListenerWrapper() {}

  virtual void SayGoodbyeJoint(b2Joint* joint) = 0;
  virtual void SayGoodbyeFixture(b2Fixture* fixture) = 0;

  void SayGoodbye(b2Joint* joint) {
    SayGoodbyeJoint(joint);
  }

  void SayGoodbye(b2Fixture* fixture) {
    SayGoodbyeFixture(fixture);
  }
};

EMSCRIPTEN_BINDINGS(my_module) {
  constant("b2_nullFeature", b2_nullFeature);
  function("b2GetPointStates", &b2GetPointStates, allow_raw_pointers());
  function("b2CollideCircles", &b2CollideCircles, allow_raw_pointers());
  function("b2CollidePolygonAndCircle", &b2CollidePolygonAndCircle, allow_raw_pointers());
  function("b2CollidePolygons", &b2CollidePolygons, allow_raw_pointers());
  function("b2CollideEdgeAndCircle", &b2CollideEdgeAndCircle, allow_raw_pointers());
  function("b2CollideEdgeAndPolygon", &b2CollideEdgeAndPolygon, allow_raw_pointers());
  function("b2ClipSegmentToLine", &b2ClipSegmentToLine, allow_raw_pointers());
  function("b2TestOverlap_2", select_overload<bool(const b2AABB&, const b2AABB&)>(&b2TestOverlap), allow_raw_pointers());
  function("b2TestOverlap_6", select_overload<bool(const b2Shape*, int32, const b2Shape*, int32, const b2Transform&, const b2Transform&)>(&b2TestOverlap), allow_raw_pointers());
}

#include "build/box2d_glue.cpp"