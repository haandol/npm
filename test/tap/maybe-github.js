var test = require("tap").test
var npm = require("../../lib/npm.js")
var maybeGithub = require("../../lib/cache/maybe-github.js")

test("should throw with no parameters", function (t) {
  t.plan(1)

  t.throws(function () {
    maybeGithub();
  }, "throws when called without parameters")
})

test("should throw with wrong parameter types", function (t) {
  t.plan(3)

  t.throws(function () {
    maybeGithub({}, new Error(), function () {})
  }, "expects only a package name")

  t.throws(function () {
    maybeGithub("npm/xxx-noexist", null, function () {})
  }, "expects to be called after a previous check already failed")

  t.throws(function () {
    maybeGithub("npm/xxx-noexist", new Error(), "ham")
  }, "is always async")
})

test("should find an existing package on Github", function (t) {
  npm.load({}, function (error) {
    t.notOk(error, "bootstrapping succeeds")
    t.doesNotThrow(function () {
      maybeGithub("npm/npm", new Error("not on filesystem"), function (error, data) {
        t.notOk(error, "no issues in looking things up")
        t.ok(data, "received metadata from Github")
        t.end()
      })
    })
  })
})

test("shouldn't find a nonexistent package on Github", function (t) {
  npm.load({}, function () {
    t.doesNotThrow(function () {
      maybeGithub("npm/xxx-noexist", new Error("not on filesystem"), function (error, data) {
        t.equal(
          error.message,
          "not on filesystem",
          "passed through original error message"
        )
        t.notOk(data, "didn't pass any metadata")
        t.end()
      })
    })
  })
})
