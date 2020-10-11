Object.defineProperty(b2RopeDef.prototype, 'position', { get: b2RopeDef.prototype.get_position, set: b2RopeDef.prototype.set_position });
  b2RopeDef.prototype['get_masses'] = b2RopeDef.prototype.get_masses = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_b2RopeDef_get_masses_0(self), b2Vec2);
};
b2RopeDef.prototype['set_masses'] = b2RopeDef.prototype.set_masses = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_b2RopeDef_set_masses_1(self, arg0);
};