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
// #include <emscripten.h>
#include <emscripten/bind.h>
#include <array>

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

// unbound functions that we weren't able to describe in WebIDL
EMSCRIPTEN_BINDINGS(my_module) {
  constant("b2_nullFeature", b2_nullFeature);
  enum_<b2PointState>("b2PointState")
    .value("b2_nullState", b2PointState::b2_nullState)
    .value("b2_addState", b2PointState::b2_addState)
    .value("b2_persistState", b2PointState::b2_persistState)
    .value("b2_removeState", b2PointState::b2_removeState)
    ;
  class_<b2Vec2>("b2Vec2")
    .property("x", &b2Vec2::x)
    .property("y", &b2Vec2::y)
    ;
  enum_<b2ContactFeature::Type>("b2ContactFeature::Type")
    .value("e_vertex", b2ContactFeature::Type::e_vertex)
    .value("e_face", b2ContactFeature::Type::e_face)
    ;
  class_<b2ContactFeature>("b2ContactFeature")
    .property("indexA", &b2ContactFeature::indexA)
    .property("indexB", &b2ContactFeature::indexB)
    .property("typeA", &b2ContactFeature::typeA)
    .property("typeB", &b2ContactFeature::typeB)
    ;
  class_<b2ContactID>("b2ContactID")
    .property("cf", &b2ContactID::cf)
    ;
  class_<b2ManifoldPoint>("b2ManifoldPoint")
    .property("localPoint", &b2ManifoldPoint::localPoint)
    .property("normalImpulse", &b2ManifoldPoint::normalImpulse)
    .property("tangentImpulse", &b2ManifoldPoint::tangentImpulse)
    .property("id", &b2ManifoldPoint::id)
    ;
  value_array<std::array<b2ManifoldPoint, 2>>("array_b2ManifoldPoint_2")
    .element(emscripten::index<0>())
    .element(emscripten::index<1>())
    ;
  class_<b2Manifold>("b2Manifold")
    .property("points", &b2Manifold::points)
    .property("localNormal", &b2Manifold::localNormal)
    .property("localPoint", &b2Manifold::localPoint)
    .property("type", &b2Manifold::type)
    .property("pointCount", &b2Manifold::pointCount)
    ;
  value_array<std::array<b2PointState, 2>>("array_b2PointState_2")
    .element(emscripten::index<0>())
    .element(emscripten::index<1>())
    ;
  function("b2GetPointStates", &b2GetPointStates, allow_raw_pointers());
  // function("b2CollideCircles", &b2CollideCircles, allow_raw_pointers());
  // function("b2CollidePolygonAndCircle", &b2CollidePolygonAndCircle, allow_raw_pointers());
  // function("b2CollidePolygons", &b2CollidePolygons, allow_raw_pointers());
  // function("b2CollideEdgeAndCircle", &b2CollideEdgeAndCircle, allow_raw_pointers());
  // function("b2CollideEdgeAndPolygon", &b2CollideEdgeAndPolygon, allow_raw_pointers());
  // function("b2ClipSegmentToLine", &b2ClipSegmentToLine, allow_raw_pointers());
  // function("b2TestOverlap_2", select_overload<bool(const b2AABB&, const b2AABB&)>(&b2TestOverlap), allow_raw_pointers());
  // function("b2TestOverlap_6", select_overload<bool(const b2Shape*, int32, const b2Shape*, int32, const b2Transform&, const b2Transform&)>(&b2TestOverlap), allow_raw_pointers());
}

#include "build/box2d_glue.cpp"

// member functions that we weren't quite able to describe in WebIDL
extern "C" {
float* EMSCRIPTEN_KEEPALIVE emscripten_bind_b2RopeDef_get_masses_0(b2RopeDef* self) {
  return self->masses;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_b2RopeDef_set_masses_1(b2RopeDef* self, float* arg0) {
  self->masses = arg0;
}
}