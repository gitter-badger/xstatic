"use strict"

const Collection = require('../collection')

module.exports = function(project) { return function(files, options) {

  const collection = new Collection('json', [ files ], options)

  function parse(file) {
    const json = JSON.parse(file.body)
    return {
      json: json
    }
  }

  collection.onChange = function(create) {

    files.forEach(function(file){

      const load = file.load.then(parse)

      create(file.path, load, [ file ])

    })
  }

  return collection
}}