/*
 * From Box2D.js
 * @see https://github.com/kripken/box2d.js/blob/02e0f2c/glue_stub.cpp
 * @author Mark Logan
 * @license Zlib https://opensource.org/licenses/Zlib
 * License evidence: https://github.com/kripken/box2d.js/blob/master/README.markdown#box2djs
 *   "box2d.js is zlib licensed, just like Box2D."
 */
#include <box2d/box2d.h>

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

#include "box2d/build/box2d_glue.cpp"