import uglify from 'rollup-plugin-uglify';
import config from './base.js'

config.dest = 'dist/esri-leaflet-cluster.js';
config.sourceMap = 'dist/esri-leaflet-cluster.js.map';

// use a Regex to preserve copyright text
config.plugins.push(uglify({ output: { comments: /Institute, Inc/} }));

export default config;