/**
 * @author shawn
 */

var cookie  = {
		get: function(name){
            var cookieValue = null; 
            if (document.cookie && document.cookie != '') { 
                var cookies = document.cookie.split(';'); 
                for (var i = 0; i < cookies.length; i++) { 
                    var cookie = cookies[i].replace(/(^\s*)|(\s*$)/g,"");
                    if (cookie.substring(0, name.length + 1) == (name + '=')) { 
                        cookieValue = unescape(cookie.substring(name.length + 1)); 
                        break; 
                    } 
                } 
            } 
            return cookieValue; 
        },
        set:  function(/*String*/name, /*String*/value,/*Number?*/days, /*String?*/path,/*String?*/domain,/*boolean?*/secure){
            if(value === null) {
                this.setEscape(name, null, days, path, domain, secure);
            } else {
                this.setEscape(name, escape(value), days, path, domain, secure);
            }
        },
        setEscape: function(/*String*/name, /*String*/value,/*Number?*/days, /*String?*/path,/*String?*/domain,/*boolean?*/secure){
            var expires = -1,
                d = new Date();
            if(value == null){
                d.setTime(d.getTime() - (24*60*60*1000));
                expires = d.toGMTString();
            } else if((typeof days === "number")&&(days >= 0)){
                d.setTime(d.getTime()+(days*24*60*60*1000));
                expires = d.toGMTString();
            }
            document.cookie = name + "=" + value + ";"
                + (expires != -1 ? " expires=" + expires + ";" : "")
                + (path ? "path=" + path : "")
                + (domain ? "; domain=" + domain : "")
                + (secure ? "; secure" : "");
        }
};

module.exports =  cookie;