const { genConfig } = require('../');
import { defineConfig, tapXixiConfig } from '../config';
import { mergeConfig } from '../config/utils';
module.exports = defineConfig(genConfig(__dirname));
