#grunt-split

Grunt plugin that lets you split your gruntfile configuration into multiple files. You are not limited to defining one task per configuration file. Each file extends the configuration object meaning each file can contain a slice of the full configuration stack. This is particularly useful if you distribute a seed project in which you want separate features to be enabled or disabled from the build process.

##Features

- Each configuration file can contain any number of task configurations.

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


##Installation

`npm install -D grunt-split`

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

