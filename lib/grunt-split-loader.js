var path = require('path');


/**********************************************************************
** Load and extend Lodash
**********************************************************************/
var _ = require('lodash');

_.mixin({
  override:function(obja,objb){
    var aObj=_.isObject(obja);
    var bObj=_.isObject(objb);
    var aArr=_.isArray(obja);
    var bArr=_.isArray(objb);

    if(aArr){
      obja=_.union(obja,objb);
    }else if(aObj){
      if(bObj){
        _.each(objb,function(v,k,l){
          if(_.has(obja,k)){
            obja[k]=_.override(obja[k],v);
          }else{
            obja[k]=v;
          }
        });
      }else{
        obja=objb;
      }
    }else{
      if(!_.isUndefined(objb)){
        obja=objb;
      }
    }
    return obja;
  }
});
/**===================================================================**/


module.exports = function(grunt, options, parameters) {
  var cwd = process.cwd();
  var tasks = [];

  var defaults = {
    files:[],
  };

  options = grunt.util._.extend({}, defaults, options, parameters);

  //////////////////////////////////////////////////////////////////////
  // Default configuration object
  //
  var config={
    npm_tasks: [],
    config: {},
    aliasses: {}
  };

  //////////////////////////////////////////////////////////////////////
  // Merge all the configuration files in the file list
  //
  _.each(options.files,function(file){
    console.log(path.join(cwd,file));
    nconfig=require(path.join(cwd,file));
    if(_.isFunction(nconfig)){
      config=_.override(config,nconfig(parameters));
    }else{
      config=_.override(config,nconfig);
    }
  });

  //////////////////////////////////////////////////////////////////////
  // Register all npm tasks as they are required by the different 
  //   feature files.
  //
  _.each(config.npm_tasks,function(task){
    if(_.indexOf(tasks,task)<0){
      tasks.push(task);
      grunt.loadNpmTasks(task);
    }
  });

  //////////////////////////////////////////////////////////////////////
  // Register any grunt task aliasses 
  //
  _.each(config.aliasses,function(tasks,alias){
    grunt.registerTask(alias,tasks);
  });

  //////////////////////////////////////////////////////////////////////
  // Return the merged config file for grunt to deal with.
  //
  return config.config;

};
