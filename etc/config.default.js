var base = process.cwd()
  , config = {
        paths: {
            etc: base + '/etc'
          , lib: base + '/lib'
          , pub: base + '/public'
          , views: base + '/views'
        }
      , port: 8080
    }

module.exports = config;