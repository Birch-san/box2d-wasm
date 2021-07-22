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
// bonus parts of liquidfun didn't make the cut either
#include <box2d/b2_voronoi_diagram.h>

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
  virtual void SayGoodbyeParticleGroup(b2ParticleGroup* group) = 0;
  virtual void SayGoodbyeParticleSystemIndex(b2ParticleSystem* particleSystem, int32 index) = 0;

  void SayGoodbye(b2Joint* joint) {
    SayGoodbyeJoint(joint);
  }

  void SayGoodbye(b2Fixture* fixture) {
    SayGoodbyeFixture(fixture);
  }

  void SayGoodbye(b2ParticleGroup* group) {
    SayGoodbyeParticleGroup(group);
  }

  void SayGoodbye(b2ParticleSystem* particleSystem, int32 index) {
    SayGoodbyeParticleSystemIndex(particleSystem, index);
  }
};

// liquidfun introduces overloads of BeginContact and EndContact.
// this abstraction assigns unique method names to each overload, to help JS bind to them.
class b2ContactListenerWrapper : public b2ContactListener {
public:
  virtual ~b2ContactListenerWrapper() {}

  virtual void BeginContact(b2Contact* contact) = 0;
  virtual void EndContact(b2Contact* contact) = 0;
  virtual void BeginContactParticleSystemParticleBodyContact(b2ParticleSystem* particleSystem,
							  b2ParticleBodyContact* particleBodyContact) = 0;
  virtual void EndContactFixtureParticleSystemIndex(b2Fixture* fixture,
							b2ParticleSystem* particleSystem, int32 index) = 0;
  virtual void BeginContactParticleSystemParticleContact(b2ParticleSystem* particleSystem,
							  b2ParticleContact* particleContact) = 0;
  virtual void EndContactParticleSystemIndexIndex(b2ParticleSystem* particleSystem,
							int32 indexA, int32 indexB) = 0;
  virtual void PreSolve(b2Contact* contact, const b2Manifold* oldManifold) = 0;
  virtual void PostSolve(b2Contact* contact, const b2ContactImpulse* impulse) = 0;

	void BeginContact(b2ParticleSystem* particleSystem,
							  b2ParticleBodyContact* particleBodyContact) {
    BeginContactParticleSystemParticleBodyContact(particleSystem, particleBodyContact);
	}

	void EndContact(b2Fixture* fixture,
							b2ParticleSystem* particleSystem, int32 index) {
    EndContactFixtureParticleSystemIndex(fixture, particleSystem, index);
	}

	void BeginContact(b2ParticleSystem* particleSystem,
							  b2ParticleContact* particleContact) {
    BeginContactParticleSystemParticleContact(particleSystem, particleContact);
	}

	void EndContact(b2ParticleSystem* particleSystem,
							int32 indexA, int32 indexB) {
    EndContactParticleSystemIndexIndex(particleSystem, indexA, indexB);
	}
};

class b2ContactFilterWrapper : public b2ContactFilter {
public:
  virtual ~b2ContactFilterWrapper() {}

  virtual bool ShouldCollide(b2Fixture* fixtureA, b2Fixture* fixtureB) = 0;
  virtual bool ShouldCollideFixtureParticleSystemIndex(b2Fixture* fixture,
							   b2ParticleSystem* particleSystem,
							   int32 particleIndex) = 0;
  virtual bool ShouldCollideParticleSystemIndexIndex(b2ParticleSystem* particleSystem,
							   int32 particleIndexA, int32 particleIndexB) = 0;

  bool ShouldCollide(b2Fixture* fixture,
							   b2ParticleSystem* particleSystem,
							   int32 particleIndex) {
    return ShouldCollideFixtureParticleSystemIndex(fixture, particleSystem, particleIndex);
  }
  bool ShouldCollide(b2ParticleSystem* particleSystem,
							   int32 particleIndexA, int32 particleIndexB) {
    return ShouldCollideParticleSystemIndexIndex(particleSystem, particleIndexA, particleIndexB);
  }
};

#include "build/common/box2d_glue.cpp"

// implement JSNodeCallback manually, to override operator() correctly
class JSNodeCallback : public b2VoronoiDiagram::NodeCallback {
public:
  void operator()(int a, int b, int c)  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['JSNodeCallback'])[$0];
      if (!self.hasOwnProperty('op_call')) throw 'a JSImplementation must implement all functions, you forgot JSNodeCallback::op_call.';
      self['op_call']($1,$2,$3);
    }, (int)this, a, b, c);
  }
  void __destroy__()  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['JSNodeCallback'])[$0];
      if (!self.hasOwnProperty('__destroy__')) throw 'a JSImplementation must implement all functions, you forgot JSNodeCallback::__destroy__.';
      self['__destroy__']();
    }, (int)this);
  }
};

extern "C" {
// member functions that we weren't able to describe in WebIDL (e.g. pointer-to-float params)
float* EMSCRIPTEN_KEEPALIVE emscripten_bind_b2RopeDef_get_masses_0(b2RopeDef* self) {
  return self->masses;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_b2RopeDef_set_masses_1(b2RopeDef* self, float* arg0) {
  self->masses = arg0;
}

// binding JSNodeCallback manually in order to bind operator() method correctly
JSNodeCallback* EMSCRIPTEN_KEEPALIVE emscripten_bind_JSNodeCallback_JSNodeCallback_0() {
  return new JSNodeCallback();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_JSNodeCallback_op_call_3(JSNodeCallback* self, int a, int b, int c) {
  (*self)(a, b, c);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_JSNodeCallback___destroy___0(JSNodeCallback* self) {
  delete self;
}

// global functions that we weren't able to describe in WebIDL (think it only supports classes/methods)
void EMSCRIPTEN_KEEPALIVE emscripten_bind_b2GetPointStates_4(
  b2PointState* state1, b2PointState* state2,
  b2Manifold* manifold1, b2Manifold* manifold2
  ) {
  b2GetPointStates(
    reinterpret_cast<b2PointState(&)[b2_maxManifoldPoints]>(state1),
    reinterpret_cast<b2PointState(&)[b2_maxManifoldPoints]>(state2),
    manifold1, manifold2
    );
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_b2CollideCircles_5(
  b2Manifold* manifold,
  b2CircleShape* circleA, b2Transform* xfA,
  b2CircleShape* circleB, b2Transform* xfB
  ) {
  b2CollideCircles(
    manifold,
    circleA, *xfA,
    circleB, *xfB
    );
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_b2CollidePolygonAndCircle_5(
  b2Manifold* manifold,
  b2PolygonShape* polygonA, b2Transform* xfA,
  b2CircleShape* circleB, b2Transform* xfB
  ) {
  b2CollidePolygonAndCircle(
    manifold,
    polygonA, *xfA,
    circleB, *xfB
    );
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_b2CollidePolygons_5(
  b2Manifold* manifold,
  b2PolygonShape* polygonA, b2Transform* xfA,
  b2PolygonShape* polygonB, b2Transform* xfB
  ) {
  b2CollidePolygons(
    manifold,
    polygonA, *xfA,
    polygonB, *xfB
    );
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_b2CollideEdgeAndCircle_5(
  b2Manifold* manifold,
  b2EdgeShape* edgeA, b2Transform* xfA,
  b2CircleShape* circleB, b2Transform* xfB
  ) {
  b2CollideEdgeAndCircle(
    manifold,
    edgeA, *xfA,
    circleB, *xfB
    );
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_b2CollideEdgeAndPolygon_5(
  b2Manifold* manifold,
  b2EdgeShape* edgeA, b2Transform* xfA,
  b2PolygonShape* polygonB, b2Transform* xfB
  ) {
  b2CollideEdgeAndPolygon(
    manifold,
    edgeA, *xfA,
    polygonB, *xfB
    );
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_b2ClipSegmentToLine_5(
  b2ClipVertex* vOut, b2ClipVertex* vIn,
  b2Vec2* normal, float offset,
  int vertexIndexA
  ) {
  return static_cast<int>(
    b2ClipSegmentToLine(
      reinterpret_cast<b2ClipVertex(&)[2]>(vOut),
      reinterpret_cast<b2ClipVertex(&)[2]>(vIn),
      *normal, offset,
      static_cast<int32>(vertexIndexA)
      )
    );
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_b2TestOverlap_6(
  b2Shape* shapeA, int indexA,
  b2Shape* shapeB, int indexB,
  b2Transform* xfA, b2Transform* xfB
  ) {
  return b2TestOverlap(
    shapeA, static_cast<int32>(indexA),
    shapeB, static_cast<int32>(indexB),
    *xfA, *xfB
    );
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_b2TestOverlap_2(b2AABB* a, b2AABB* b) {
  return b2TestOverlap(*a, *b);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_b2LinearStiffness_6(
  float* stiffness, float* damping,
	float frequencyHertz, float dampingRatio,
	const b2Body* bodyA, const b2Body* bodyB
) {
  b2LinearStiffness(
    *stiffness, *damping,
    frequencyHertz, dampingRatio,
    bodyA, bodyB
  );
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_b2AngularStiffness_6(
  float* stiffness, float* damping,
	float frequencyHertz, float dampingRatio,
	const b2Body* bodyA, const b2Body* bodyB
) {
  b2AngularStiffness(
    *stiffness, *damping,
    frequencyHertz, dampingRatio,
    bodyA, bodyB
  );
}
}