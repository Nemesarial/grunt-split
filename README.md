#grunt-split

Grunt plugin that lets you split your gruntfile configuration into multiple files. You are not limited to defining one task per configuration file. Each file extends the configuration object meaning each file can contain a slice of the full configuration stack. This is particularly useful if you distribute a seed project in which you want separate features to be enabled or disabled from the build process.

##TL;DR

- Each configuration file can contain any number of task configurations.
- Configuration files are merged in the order in which they are included.
- See the section on merge conflict resolution below for the merge rules.



##Installation

`npm install -D grunt-split`

##Syntax
The object returned on module.exports for each of the split config files have 3 possible properties
in the root object:
```javascript
module.exports={
	npm_tasks:[],
	config: {},
	aliasses: {}
}
```
####npm_tasks
This allows you to set the grunt dependencies for that particular configuration file.
Any tasks listed in this array will be loaded using `grunt.npmLoadTasks()`. That way you can keep your grunt instance as thin as possible.

####config
This is where the configuration lives. Configure any grunt plugins here keeping in mind how the merge-rules will determine how they merge
with other configuration files.

####aliasses
This is where you can specify grunt task aliasses that will be registered via `grunt.registerTask()`.
#####syntax
```javascript
module.exports={
	aliasses:{
		jobName:['task','task']
	}
}
```

##Example

```javascript
module.exports = function(grunt) {

	require('grunt-split')(grunt,{
			files:[
				'grunt/bootstrap.conf.js',
			//	'grunt/angular.conf.js',
				'grunt/font-awesome.conf.js',
			]
		});

};
```

grunt/bootstrap.conf.js
```javascript
module.exports = {
	npm_tasks:[
		'grunt-contrib-concat',
		'grunt-contrib-watch',
		'grunt-contrib-less'
	],
	config:{
		less:{
			bootstrap:{
				//bootstrap less compilation configuration goes here
			}
		},
		concat:{
			bootstrap:{
			//concatenate any css and javascript here
			}
		},
		watch:{
			bootstrap:{
				//instructions on what to watch
			}
		}
	},
	aliasses:{
		'watch_all',['watch:bootstrap']
	}
}
```

##Alternative Implementation
There is an alternative implementation that allows one to send parameters from the calling grunt file to all the includes.

```javascript
module.exports = function(grunt) {

	require('grunt-split')(grunt,{
			files:[
				'grunt/bootstrap.conf.js',
			//	'grunt/angular.conf.js',
				'grunt/font-awesome.conf.js',
			]
		},parameters);

};
```

grunt/bootstrap.conf.js
```javascript
module.exports = function(parameters){
	var config={
		npm_tasks:[
			'grunt-contrib-concat',
			'grunt-contrib-watch',
			'grunt-contrib-less'
		],
		config:{
			less:{
				bootstrap:{
					//bootstrap less compilation configuration goes here
	                                //use parameters here
				}
			},
			concat:{
				bootstrap:{
				//concatenate any css and javascript here
				}
			},
			watch:{
				bootstrap:{
					//instructions on what to watch
				}
			}
		},
		aliasses:{
			'watch_all',['watch:bootstrap']
		}
	};

	return config;
}
```
##Merge Conflict Resolution
It is useful knowing how the objects read from the different files get extended when a conflict is encountered

###Object Properties get overridden
```javascript
// File 1
obj={
	key1:'value1'
}

// File 2
obj={
	key1:'value2',
	key2:'value2'
}

// Results In
obj={
	key1:'value2',
	key2:'value2'
}
```


###Object Properties get overridden unless they are objects, then they are extended
```javascript
// File 1
obj={
	key1:{keyA:'value1'},
	key2:{keyA:'value1',keyB:'value2'}
}

// File 2
obj={
	key1:'value3',
	key2:{KeyA:'value3',keyC:'value3'}
}

// Results In
obj={
	key1:'value3',
	key2:{keyA:'value3',keyB:'value2',keyC:'value3'}
}
```


###Array Properties get augmented
```javascript
// File 1
obj={
	key1:['value1']
}

// File 2
obj={
	key1:['value2']
}

// Results In
obj={
	key1:['value1','value2'],
}
```

