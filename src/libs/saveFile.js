import Vue from 'vue'

import {saveAs} from 'file-saver'

Vue.prototype.$saveFile = saveAs

export default saveAs