"use strict"

const Babel = require('babel')

const Collection = require('../collection')
const _ = require('../utils')

module.exports = function(project) { return function(files, options) {

  options =  _.merge({
    path: function(path) { return path.setExt('js') },
    babel: {
      // sourceMaps: true,
      // stage: 2,
      // compact: false,
    }
  }, options)

  const collection = new Collection('babel', [ files ])

  function babel(file) {
    return Babel.transform(file.body, _.merge({
      // filename: file.path,
      ast: false,
    }, options.babel))
  }

  function returnCode(result) {
    return {
      body: result.code
    }
  }

  function returnMap(result) {
    return {
      body: JSON.stringify(result.map)
    }
  }

  collection.onChange = function(create) {

    files.forEach(function(file){

      const compile = file.load.then(babel)

      create(file.path, compile.then(returnCode), [ file ])
      // create(file.path + '.map', compile.then(returnMap), [ file ])

    })
  }

  return collection
}}
