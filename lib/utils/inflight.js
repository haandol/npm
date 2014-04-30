'use strict';

var urls = {}
  , names = {}

module.exports = {
  // Only have a single download action at once for a given url additional
  // calls stack the callbacks.
  addURL : function addURL (url, listener, callback) {
    if (!urls[url]) urls[url] = []

    var requests = urls[url]
    requests.push(listener)

    function done(error, data) {
      var l
      while (l = requests.shift()) l(error, data)
      delete urls[url]
    }

    if (requests.length === 1) callback(done)
  },
  // Only have one request in flight for a given name@blah thing.
  addName : function addName (name, version, listener, callback) {
    var key = name + "@" + version

    if (!names[key]) names[key] = []

    var requests = names[key]
    requests.push(listener)

    function done (error, data) {
      var l
      while (l = requests.shift()) l(error, data)
      delete names[key]
    }

    if (requests.length === 1) callback(key, done)
  }
}
