
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
                format = 'YYYY-MM-DD';
            }
            return format.replace(/YYYY/,dt.getFullYear()).
                    replace(/MM/,dt.getMonth()+1).replace(/DD/,dt.getDate()).
                    replace(/hh/,dt.getHours()).replace(/mm/,dt.getMinutes()).replace(/ss/,dt.getSeconds());
        },
        parseDate: function(str,fm){
            var dt = null;
            if(!fm){
                fm  = 'YYYY-MM-DD';
            }
            if(fm.length === 10 && /(\d{4})-(\d{1,2})-(\d{1,2})/.test(str)){
                dt = new Date(parseInt(RegExp.$1,10),
                    parseInt(RegExp.$2,10)-1, 
                    parseInt(RegExp.$3,10));
            }else if(/(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/.test(str)){
            	dt = new Date(parseInt(RegExp.$1,10),
                        parseInt(RegExp.$2,10)-1, 
                        parseInt(RegExp.$3,10),
                        parseInt(RegExp.$4,10),
                        parseInt(RegExp.$5,10),
                        parseInt(RegExp.$6,10));
            }
            return dt;
        }
    
    };  
    
    module.exports = format;