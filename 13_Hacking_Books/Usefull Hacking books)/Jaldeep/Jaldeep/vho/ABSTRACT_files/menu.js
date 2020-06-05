/*
* Project				:	Interscience Accessibility
* File					:	menu.js
* Creation Date				:	26th May 2005
* Author				:	Ben Marvell
*
* Various functions to deliver personalisation functionality.
*/

// route browser to required menu function
var runonce = false;
var dom = (document.getElementById) ? true : false;

var rollimg = new Image();
rollimg.src = "http://download.interscience.wiley.com/images/menu.arrow.1.gif";

function wisMenu(){
	if (!runonce){
		runonce = true;
		if ((navigator.userAgent.indexOf("Mac") != -1) && (navigator.userAgent.indexOf("MSIE") != -1) || (navigator.userAgent.indexOf("Netscape6") != -1)){
			return;
		} else if (dom){
			var classname = "menuDOM";
			menuHoverDOM(classname);
			fixInlineLists(); // fix the inline lists
		}
	}else{
		if ((navigator.userAgent.indexOf("Mac") != -1) && (navigator.userAgent.indexOf("MSIE") != -1) || (navigator.userAgent.indexOf("Netscape6") != -1)){
		    var classname = "menuIEMAC";
		    menuHoverDOM(classname);
		} else if (dom){
			fixInlineLists(); // fix the inline lists
			return;
		} else if(document.all){
			fixMenuIE4();
		}
	}
}

// dom supported browsers
//@@@DM It was anoying me this error
var menuHoverDOM = function(classname){
	
	var subnodeslength = (typeof(submenulength) != "undefined") ? (submenulength + 1) : 8;
	if (document.getElementById("menu")){
		var menu = document.getElementById("menu").getElementsByTagName("UL")[0];
		
		//	AP	06/12/2007	BUG3622	- Prevent error on production interface if personalisation bar doesn't exist.
		if(typeof menu == "undefined") return;
		
		// apply menuDOM class and user class
		menu.className = classname;
		if (document.getElementById("user")){
			document.getElementById("user").className = classname;
		}
		//if no userdata loaded then padd the lists to the right
		if (menu.getElementsByTagName("LI").length == 2){
			menu.style.paddingLeft = "5em";
		}
		
		//loop through li elements
		for (var x=0; x<menu.childNodes.length; x++){
		    if (menu.childNodes[x].nodeName == "LI"){	      
		        for (var y=0; y<menu.childNodes[x].childNodes.length; y++){        
		            //if element has sub menu apply appropirate image class (ie all code in this statment is for drop menus)
		            if (menu.childNodes[x].childNodes[y].nodeName == "UL"){
		            	// setup some common variables to make the code shorter		        
		            	var lilength = parseInt(menu.childNodes[x].childNodes[y].getElementsByTagName("LI").length);		            
		            	var liels = menu.childNodes[x].childNodes[y].getElementsByTagName("LI");
		            	// set parent li to have the sub menu arrow
		                menu.childNodes[x].className = "domArrowOut";
		               		               		                
		                // set the amount of saved titles for the parent li's ie (5 saved searches)
		                var menuamount = (lilength-3);
		                if (menuamount < 0) menuamount = 0;
		                menu.childNodes[x].getElementsByTagName("A")[0].innerHTML = menuamount + " " + menu.childNodes[x].getElementsByTagName("A")[0].innerHTML;
		                
		                // checks the submenu and shows no data message if user doesnt have any data saved		                		              
	                    var tmpinnerhtml = "";                  
	                    if (lilength <= 3){	                 
		                    for (var j=0; j<lilength; j++){                          		                       
	                            if (j==0)
	                                tmpinnerhtml += "<li>" + liels[j].innerHTML + "</li><li class='nosaved'><em>You do not have anything saved in this menu.</em></li>";
	                            else
	                                tmpinnerhtml += "<li class='hide'>" + liels[j].innerHTML + "</li>";	                            
	                    	}	                    
	                    } else {
	                    	//setup var to see if more is required
	                    	var more = (subnodeslength < lilength) ? true : false;	                    	
	                    	var flag = true;
	                    	for (var j=0; j<lilength; j++){	                    	
	                    		// if we only have 8 menu elements then just display them else delete the rest and add a more button
	                    		if (j < subnodeslength){
	                    			tmpinnerhtml += "<li>" + liels[j].innerHTML + "</li>";
	                    		} else if (j > lilength-3){
	                    			if (j == lilength-2){
	                    				var url = liels[j].innerHTML.split('"')[1];
	                    				tmpinnerhtml += "<li><a href='"+url+"' target='_top'>more...</a></li><li>" + liels[j].innerHTML + "</li>";
	                    			} else {
	                    				tmpinnerhtml += "<li>" + liels[j].innerHTML + "</li>"; 
	                    			}                 			
	                    		}	
	                    	}
	                    	// set last two menu items to have no rollover and a border at the top                   	
	                    }
	                    menu.childNodes[x].childNodes[y].innerHTML = tmpinnerhtml;
	                    // set default menu elements with diff style
	                    if (flag){
		                    if (more){
				                liels[liels.length-3].style.borderTop = "1px solid #DDDDDD";
				                liels[liels.length-3].className = "noroll";
				                liels[liels.length-2].style.borderTop = "1px solid #DDDDDD";
				                liels[liels.length-2].className = "noroll";
				                liels[liels.length-1].className = "noroll";
				                more = false;
					        } else {
				            	liels[liels.length-2].style.borderTop = "1px solid #DDDDDD";
				                liels[liels.length-2].className = "noroll";
				                liels[liels.length-1].className = "noroll";
					        }					        
							flag = false;					     
					    } 
	                    	                    
		                // set sub menu title for the msnu
		                liels[0].className = "hoverTitle";
		                // apply rollover functions to hide/show sub menus
		                if (classname == "menuDOM"){
	    	                menu.childNodes[x].onmouseover = function(){
	        	                // safari doesnt handle auto in absoulte positioning correctly so this code makes the menus display correctly.
								if (navigator.userAgent.indexOf("Safari") != -1){
								   	if(!window.devicePixelRatio) {
									 this.getElementsByTagName("UL")[0].style.marginTop = "20px";
									 this.getElementsByTagName("UL")[0].style.marginLeft = "0";
								  	}
								}
	        	                this.className ="menuhover domArrowOver";
	        	            }
	        	            menu.childNodes[x].onmouseout=function() {
	            			    this.className = "domArrowOut";
	        		        }
	    		        }
		            }            
		        }
		        // deletes the sub menus on the IEMAC as they have a background bug, will still remain on NS6
		    	if ((navigator.userAgent.indexOf("Mac") != -1) && (navigator.userAgent.indexOf("MSIE") != -1)){
	            	menu.childNodes[x].innerHTML = menu.childNodes[x].innerHTML.split("<UL")[0];
	            }                    	
		    }
		}
	}
};
//@@@DM It was anoying me this error		
var fixMenuIE4 = function(){
	if (document.all["menu"]){
		var tmptable = "<table class='menuIEFOUR' align='right' border='0' cellpadding='0' cellspacing='0' height='25'><tr>"
		var menu = document.all["menu"].children[0];
		menu.style.marginBottom = "-3px";
		for (var x=1; x<menu.children.length; x++){
	        if (userName != ""){
		        var tmp = menu.children[x].innerHTML.split("<UL")[0];
				if (x==1){
				    tmptable += "<td width='15'></td><td width='180' class='menuIEFOURUser'><span>" + tmp + "</span></td>";
				} else if (x==5 || x==6){ 
				    tmptable += "<td width='15' class='menuIEFOURDOWN'></td><td width='70'><span>" + tmp + "</span></td>";
				} else {
				    tmptable += "<td width='15' class='menuIEFOURSIDE'></td><td width='70'><span>" + tmp + "</span></td>";
				}
				if (x == (menu.children.length-1)){
					tmptable += "</tr></table>";	
				}
			} else {
				var tmp = menu.children[x].innerHTML.split("<UL")[0];
				if (x==1){ 				 
					tmptable += "<td width='40'></td><td width='15' class='menuIEFOURDOWN'></td><td width='70'><span>" + tmp + "</span></td>";
				} else if (x==2) {
				    tmptable += "<td width='15' class='menuIEFOURDOWN'></td><td width='50'><span>" + tmp + "</span></td></tr></table>";
				}
			}
		}
		menu.innerHTML = tmptable;
	}
};

var menuloadedflag = true;


var time = new Date();
//@@@DM It was anoying me this error		
var ordval= (time.getTime());
