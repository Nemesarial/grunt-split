#grunt-split

Grunt plugin that lets you split your gruntfile configuration into multiple files. You are not limited to defining one task per configuration file. Each file extends the configuration object meaning each file can contain a slice of the full configuration stack. This is particularly useful if you distribute a seed project in which you want separate features to be enabled or disabled from the build process.

##Features

- Each configuration file can contain any number of task configurations.

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
