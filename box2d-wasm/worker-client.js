var SUPPORT_BASE64_EMBEDDING;
var filename;
if (!filename) {
  filename = 'Box2D.worker.js';
}

var workerURL = filename;
if (SUPPORT_BASE64_EMBEDDING) {
  var fileBytes = tryParseAsDataURI(filename);
  if (fileBytes) {
    workerURL = URL.createObjectURL(new Blob([fileBytes], {type: 'application/javascript'}));
  }
}
var worker = new Worker(workerURL);

setTimeout(function() {
  worker.postMessage({
    target: 'worker-init',
    width: Module.canvas.width,
    height: Module.canvas.height,
    boundingClientRect: cloneObject(Module.canvas.getBoundingClientRect()),
    URL: document.URL,
    currentScriptUrl: filename,
    preMain: true });
}, 0); // delay til next frame, to make sure html is ready

var workerResponded = false;

worker.onmessage = function worker_onmessage(event) {
  //dump('\nclient got ' + JSON.stringify(event.data).substr(0, 150) + '\n');
  if (!workerResponded) {
    workerResponded = true;
    if (Module.setStatus) Module.setStatus('');
    if (SUPPORT_BASE64_EMBEDDING && workerURL !== filename) URL.revokeObjectURL(workerURL);
  }

  var data = event.data;
  switch (data.target) {
    case 'stdout': {
      Module['print'](data.content);
      break;
    }
    case 'stderr': {
      Module['printErr'](data.content);
      break;
    }
    case 'window': {
      window[data.method]();
      break;
    }
    case 'tick': {
      frameId = data.id;
      worker.postMessage({ target: 'tock', id: frameId });
      break;
    }
    case 'custom': {
      if (Module['onCustomMessage']) {
        Module['onCustomMessage'](event);
      } else {
        throw 'Custom message received but client Module.onCustomMessage not implemented.';
      }
      break;
    }
    case 'setimmediate': {
      worker.postMessage({target: 'setimmediate'});
      break;
    }
    default: throw 'what? ' + data.target;
  }
};

function postCustomMessage(data, options) {
  options = options || {};
  worker.postMessage({ target: 'custom', userData: data, preMain: options.preMain });
}

function cloneObject(event) {
  var ret = {};
  for (var x in event) {
    if (x == x.toUpperCase()) continue;
    var prop = event[x];
    if (typeof prop === 'number' || typeof prop === 'string') ret[x] = prop;
  }
  return ret;
};

export {
  postCustomMessage
};