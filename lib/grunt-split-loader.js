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
  var configs={};

  _.each(options,function(files,name){
    var tasks = [];
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
    _.each(files,function(file){
      nconfig=require(path.join(cwd,file));
      if(_.isFunction(nconfig)){
        config=_.override(config,nconfig(parameters));
      }else{
        config=_.override(config,nconfig);
      }
    });

    //////////////////////////////////////////////////////////////////////
    // Return the merged config file for grunt to deal with.
    //

    config.getConfig=function(){
      return this.config;
    };

    config.registerNpmTasks=function(){
      var loaded_tasks=[];
      _.each(this.npm_tasks,function(npm_task){
        if(_.indexOf(loaded_tasks,npm_task)<0){
          loaded_tasks.push(npm_task);
          grunt.loadNpmTasks(npm_task);
        }
      });
    };

    config.initConfig=function(){
      this.registerNpmTasks();
      this.registerTasks();
      grunt.initConfig(this.config);
    };

    //////////////////////////////////////////////////////////////////////
    // Register any grunt task aliasses 
    //
    config.registerTasks=function(){
      _.each(config.aliasses,function(tasks,alias){
        grunt.registerTask(alias,tasks);
      });
    };

    configs[name]=config;
  });

  configs.getConfigObject=function(name){
    if(name){
      if(_.has(this,name)){
        return this[name];
      }else{
        return false;
      }
    }else{
      var keys=_.keys(this);
      if(keys.length>0){
        return this[keys[0]];
      }else{
        return false;
      }
    }
  };

  configs.getConfig=function(name){
    return this.getConfigObject(name).getConfig();
  };

  configs.initConfig=function(name){
    var config = this.getConfigObject(name);
    console.log('..loading config *'+name+'*');
    config.initConfig();
  };




  return configs;

};
