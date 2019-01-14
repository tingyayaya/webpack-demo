require('../css/about.css');
require('../css/reset.css');

import {sum} from '../../libs/common1.js';
var content = document.getElementById('content');
content.innerHTML = '关于我们';

var s = sum(1,2);
console.log(s);
$()