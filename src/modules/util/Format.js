
    /**
        基本的格式化工具集。
        @exports util/Format
     */
    var format = {
        /**
         * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length
         * @param {String} value The string to truncate
         * @param {Number} length The maximum length to allow before truncating
         * @return {String} The converted text
         */
        ellipsis : function(value, len){
            if(value && value.length > len){
                return value.substr(0, len-3)+"...";
            }
            return value;
        },


        /**
         * Convert certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages.
         * @param {String} value The string to encode
         * @return {String} The encoded text
         */
        htmlEncode : function(value){
            return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        },

        /**
         * Convert certain characters (&, <, >, and ') from their HTML character equivalents.
         * @param {String} value The string to decode
         * @return {String} The decoded text
         */
        htmlDecode : function(value){
            return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
        },


        /**
         * Converts the first character only of a string to upper case
         * @param {String} value The text to convert
         * @return {String} The converted text
         */
        capitalize : function(value){
            return !value ? value : value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
        },

        // private
        call : function(value, fn){
            if(arguments.length > 2){
                var args = Array.prototype.slice.call(arguments, 2);
                args.unshift(value);
                return eval(fn).apply(window, args);
            }else{
                return eval(fn).call(window, value);
            }
        },


        // private
        stripTagsRE : /<\/?[^>]+>/gi,
        
        /**
         * Strips all HTML tags
         * @param {Mixed} value The text from which to strip tags
         * @return {String} The stripped text
         */
        stripTags : function(v){
            return !v ? v : String(v).replace(this.stripTagsRE, "");
        },

        // private
        stripScriptsRe : /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,

        /**
         * Strips all script tags
         * @param {Mixed} value The text from which to strip script tags
         * @return {String} The stripped text
         */
        stripScripts : function(v){
            return !v ? v : String(v).replace(this.stripScriptsRe, "");
        },

        /**
         * Simple format for a file size (xxx bytes, xxx KB, xxx MB)
         * @param {Number/String} size The numeric value to format
         * @return {String} The formatted file size
         */
        fileSize : function(size){
            if(size < 1024) {
                return size + " bytes";
            } else if(size < 1048576) {
                return (Math.round(((size*10) / 1024))/10) + " KB";
            } else {
                return (Math.round(((size*10) / 1048576))/10) + " MB";
            }
        },


        /**
         * Converts newline characters to the HTML tag &lt;br/>
         * @param {String} The string value to format.
         * @return {String} The string with embedded &lt;br/> tags in place of newlines.
         */
        nl2br : function(v){
            return v === undefined || v === null ? '' : v.replace(/\n/g, '<br/>');
        },
        
        
        isDate: function(dt){
            return dt && typeof dt.getFullYear === 'function';
        },
        isLeapYear: function(dt){
            var year = dt.getFullYear ? dt.getFullYear() : parseInt(dt,100);
            if(year%400 === 0 || 
                year%4 === 0 && year%100 !== 0){
                return true;
            }
            return false;
        },
        fmDate:function(dt,format){
            if(!dt || dt instanceof Date === false){
                dt = new Date();
            }else if(!isNaN(dt)){
            	dt = new Date(+dt);
            }
            if(!format){
                format = 'yyyy-MM-dd';
            }
            function padZero(n){
            	return n > 9 ? n : '0' + n;
            }
            return format.replace(/yyyy/,dt.getFullYear()).
                    replace(/MM/,padZero(dt.getMonth()+1)).replace(/dd/,padZero(dt.getDate())).
                    replace(/hh/,padZero(dt.getHours())).replace(/mm/,padZero(dt.getMinutes())).
                    replace(/ss/,padZero(dt.getSeconds()));
        },
        parseDate: function(str,fm){
		    var start = 0,ch1 = null,ch2 = null;
		    var chReg = /^[yMdhms]$/,
		      nReg = /^\d$/;
		    str = str.replace(/^\s+/g,'').replace(/\s+$/,'');
		    fm = (fm || 'yyyy-MM-dd').replace(/^\s+/g,'').replace(/\s+$/,'');
		    if(str.length !== fm.length){
		        return null;
		    }
		
		    var dtArr = [];
		    function convert(start,end){
		      var tmp = parseInt(str.substring(start,end),10);
		            switch(ch1){
		                case 'y' : dtArr[0] = tmp;break;
		                case 'M' : dtArr[1] = tmp - 1;break;
		                case 'd' : dtArr[2] = tmp;break;
		                case 'h' : dtArr[3] = tmp;break;
		                case 'm' : dtArr[4] = tmp;break;
		                case 's' : dtArr[5] = tmp;break;
		                default:  throw new Error("Invalid Date.");
		            }
		    }
		
		    ch1 = fm.charAt(i);
		    var flag = true;//有效字符开始标志
		    try{
		      for(var i = 0,len = fm.length; i < len; i++){
		          ch2 = fm.charAt(i);
		          if(chReg.test(ch2) && nReg.test(str.charAt(i))){//有效日期字符
		              if(ch2 === ch1){
		                  continue;
		              }else{//新的时间
		                  ch1 = ch2;
		                  if(flag){
		                    convert(start,i);
		                  }
		                  flag = true;
		                  start  = i;
		              }
		          }else if(ch2 === str.charAt(i)){
		            if(flag){
		              convert(start,i);
		            }else{
		              start  = i;
		            }
		            flag = false;
		          }else{
		            throw new Error('format no match.');
		          }
		      }
		      convert(start,i);
		    }catch(e){
		      console.error(e);
		      return null;
		    }
		    
		    return new Date(dtArr[0],dtArr[1],dtArr[2],dtArr[3]||0,dtArr[4]||0,dtArr[5]||0,0);
		}
    
    };  
    
    module.exports = format;