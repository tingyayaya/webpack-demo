require('../css/index.css')
import base from '../../libs/base';

import {reduce} from '../../libs/common1.js';
process.env.NODE_ENV=='mock' && require('../../mock/index.js');
console.log(process.env.NODE_ENV)
console.log(reduce(1,2))
console.log(2)

$(function(){
  $.ajax({
    url: `${base.apiBaseUrl}/1.json`,
    data: {},
    success: (function(data){
      console.log(data)
    })
  })
})


