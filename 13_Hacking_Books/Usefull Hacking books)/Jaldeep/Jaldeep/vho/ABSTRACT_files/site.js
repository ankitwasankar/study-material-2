/***************************************************************************************************
 	FILE:		site.js
 	AUTHOR: 	Jonathan Sugar, Chris Neatby-Smith and Digital Pulp. July 2003.
 
 	DESCRIPTION:	Javascript relating to site wide functionality across 
 					InterScience.
 
 	INCLUDES FUNCTIONS
 	==================
 	
 	Search Functions
 	----------------
 	
 	selectAndSubmit() - for deciding where to submit a query based on the state of the form.
 	processallContentSearch() - for validating form input for an all content search.
 	processTitleSearch() - for validating form input for a Title search.
 	checkCitationSearch() - for validating the citation search form.
 	selectAll() - check all the checkboxes in a form.
	do_popup() - stasa Acronym Finder window popup function.
	
 	
 	Other Functions
 	---------------
 	
 	fixInlineLists() - 	fix netscape 4.x bug where <li> tags with images display both an image and
 						the default bullet. 	

 ***************************************************************************************************/

var http = false;
if(navigator.appName == "Microsoft Internet Explorer") {
  http = new ActiveXObject("Microsoft.XMLHTTP");
} else {
  http = new XMLHttpRequest();
} 

// Global Variables
var debug = false;
var first = true;

// Browser detect globals:
var uaStr = navigator.userAgent.toLowerCase();
var uaVer = parseInt(navigator.appVersion);
// for detecting netscape 4
var netscape = (uaStr.indexOf("mozilla") > -1);
var netscape4 = (netscape && uaVer < 5);

/*
 * Used to switch search mode between APS and TitleFinder on quicksearch boxes
 * ---------------------------------------------------------------------------
 *
 * 1.	Decides which search is required based on the value of the radio buttons
 *		in 'document.formSelector.whichForm'.
 *
 * 2.	Calls individual functions to process the forms and submit them.
 *
 */
function selectAndSubmit()
{
	var formSelection;

	// find out which form we need to process.
	var selector = document.formSelector.whichForm;
	for (var i = 0; i < selector.length; i++){
		if (selector[i].checked){
			formSelection = selector[i].value;
		}
	}
	
	// Call the relevent function to process the required form.
	if(formSelection == "allContentSearch"){
		processallContentSearch(document.allContentSearchForm, document.formSelector)
	}
	else if(formSelection == "searchTitles"){
		processTitleSearch(document.searchTitles, document.formSelector)
	}
	else{
		return false;
	}
	
	//@@@DM It was anoying me this error		
	return false;
}

/*
 * Process the allContentSearch form
 * ---------------------------------
 * 1. 	Perform form validation, checking for empty fields.
 *		Give the user a relevent message if required.
 *
 * 2.	Process/Assign the appropriate form elements and submit the form.
 */
function processallContentSearch(hiddenForm, queryForm)
{
	var formToSubmit = hiddenForm;
	var formToProcess = queryForm;
	
	// Do some basic form validation
	if(formToProcess.terms.value != "")
	{
		formToSubmit.WISsearch1.value = formToProcess.terms.value;
		formToSubmit.submit();		
	}
	else
	{
		alert("You must enter a search term in the text box before you click go.");
	}
}

/*
 * Process the Title Search form
 * -----------------------------
 * 1. 	Perform form validation, checking for empty fields.
 *		Give the user a relevent message if required.
 *
 * 2.	Process/Assign the appropriate form elements and submit the form.
 */

function processTitleSearch(hiddenForm, queryForm)
{
	var formToSubmit = hiddenForm;
	var formToProcess = queryForm;
	
	// Do some basic form validation
	if(formToProcess.terms.value != "")
	{
		formToSubmit.query.value = formToProcess.terms.value;
		formToSubmit.submit();
	}
	else
	{
		alert("You must enter a search term in the text box before you click go.");
	}
}

function doCitationSearch()
{
	var form = document.citsearchform;
	if(checkCitationSearch())
	{
		form.action = "/search/allsearch";
		form.submit();
	}
}

// Preprocesses the arguments sent to CitationSearch and checks validity of user inputs.
function checkCitationSearch()
{
	var supplementFound = 0; //increment if found;
	var hyphenFound = 0; //increment if found;
	var fm = document.citsearchform;
	var errmsg = "Please use the valid digits '0' to '9'";
	// remove all spaces
	fm.volume.value = fm.volume.value.replace(/ /g, "");
	fm.issue.value = fm.issue.value.replace(/ /g, "");
	fm.pages.value = fm.pages.value.replace(/ /g, "");

	if (fm.issn.value.length > 0 && fm.volume.value.length > 0 && fm.pages.value.length > 0)
	{
		// check page range
		var pageRange = fm.pages.value;
		var volume = fm.volume.value;
		var issue = fm.issue.value;
		var continueFlag = 0;
		//check the volume
//		if (isNaN(volume))
//		{
//			// volume failed checking
//			alert("Volume is invalid. "+errmsg+".");
//			return false;
//		}
		//check the issue
		if ((issue.length != 0) && isNaN(issue))
		{
			// issue failed checking
			alert("Issue is invalid. "+errmsg+" or leave blank.");
			return false;
		}
		//check the page range
		if (isNaN(pageRange))
		{
			var isValid = false;
			// check for hyphen
			var hyphenIndex = pageRange.indexOf("-");
			if ((hyphenIndex != -1) && (hyphenIndex == pageRange.lastIndexOf("-")))
			{
				// we have only one hyphen, so extract each number
				var firstNum  = pageRange.substring(0, hyphenIndex);
				var secondNum = pageRange.substring(hyphenIndex + 1);
				// check for S
				var firstS  = firstNum.indexOf("S");
				var secondS = secondNum.indexOf("S");
				if (firstS == secondS)
				{
					if ((firstS == -1) && isNum(firstNum) && isNum(secondNum) && (firstNum.length > 0) && (secondNum.length > 0))
						isValid = true;  // both inputs are digits
					else if (firstS == 0)
					{
						var firstNumNoS  = firstNum.substring(1);
						var secondNumNoS = secondNum.substring(1);
						if (isNum(firstNumNoS) && isNum(secondNumNoS) && (firstNumNoS.length > 0) && (secondNumNoS.length > 0))
							isValid = true; // both inputs are Sdigits
					}

				}
			}
			if (isValid)
			{
				return true;
			}
			else
			{
				alert("The page range is invalid. "+errmsg+" and a hyphen '-' if required.");
				return false;
			}
		}
		return true;
	}
	else
	{
		alert("Volume and pages are required fields. Please make sure data has been entered for both fields.");
		return false;
	}
}

// returns true if a is an Integer.
function isNum(a)
{ return !(isNaN(a)); }

function fixInlineLists() {
	if (!document.getElementById) return;
	var allLIs = document.getElementsByTagName('li');
	var bulletNode = document.createElement('img');
	bulletNode.src ="http://download.interscience.wiley.com/images/icon.bullet.gif";

	for (var i=0; i<allLIs.length; i++) {
		if(allLIs[i].parentNode.className == "inline") {
			allLIs[i].insertBefore(bulletNode.cloneNode(true),allLIs[i].firstChild);
		}
	}
};


function highlightMenuItem(oid)
{
	var loc = new String(document.location);
	var startIndex = loc.lastIndexOf("/") + 1;
	var endIndex = loc.length;
	var page = loc.substring(startIndex, endIndex);

	var links;
	if(page == "REFERENCES")
	{
		links = '<a href="/cgi-bin/abstract/' + oid + '/ABSTRACT">Abstract</a> &nbsp;|&nbsp; <strong>References</strong>';
	}
	else if (page == "ABSTRACT" || (page.indexOf("allsearch") != -1))
	{
		links = '<strong>Abstract</strong> &nbsp;|&nbsp; <a href="/cgi-bin/abstract/' + oid + '/REFERENCES">References</a>';
	}
	//alert("URL: " + loc + "\nStart Index: " + startIndex + "\nEnd Index: " + endIndex + "\nPage: " + page + "\nLink Text: " + links);
	return links;
}


function selectAll(fm)
{
	//var fm = document.viewSelectedForm;

	for (var i = 0; i < fm.elements.length; i++)
	{
		if (fm.elements[i].type == 'checkbox' /*&& fm.elements[i].name == 'ID'*/)
		{
			fm.elements[i].checked = true;
		}
	}
}


function do_popup(file)
{
		var w = window.open(file, 'popWin', 'width=350,height=500,scrollbars=yes');

}


function mailTool(itemID, useurl, skin)
{
	//var url = "/cgi-bin/mailform?item="+itemID;
	var url = "/cgi-bin/mailform?item=" + itemID + "&skin=" + skin;
	var parameters = 'status=no,scrollbars=no,resizable=yes,width=400,height=475';

	if (useurl != "")
	{
		url += "&useurl="+useurl;
	}

	if (arguments.length >= 4 && arguments[3] == 'cluster')
	{
		url += '&type=cluster';
	}

	eval("wileyMailTool = window.open('"+url+"','MailTool','"+parameters+"')");

	// If object exists ensure has focus
	if (eval("wileyMailTool") && window.focus)
		eval("wileyMailTool").focus();
}


/*
 *	1.	Find the links we need to alter.
 * 	2.	For each link apply the new styles we need.
 */
function fixAbsRefRendering()
{	
	var table = document.getElementById('prerendered');
	var anchors = table.getElementsByTagName('a');
	for (var i = 1; i < anchors.length; i++)
	{
		if(anchors[i].href !="") 
		{		
			applyAbsRefStyleCorrection(anchors[i]);
			
		}
	}
}

function applyAbsRefStyleCorrection(currentLink)
{
	currentLink.style["color"] = "#369";
	currentLink.style["fontWeight"] = "normal";
	currentLink.style["marginLeft"] = "3px";
	currentLink.style["marginRight"] = "5px";
}

function populatePage(formName)
{
	if (formName.Page.value == '')
	{
		formName.Page.value = document.location;
	}
}

function equalizeColumnWidth(numFeatures)
{
	var numberOfFeatures = numFeatures;		
	// Percentage width of table to use for each column.
	var percentPerFeature = Math.floor(100 / numberOfFeatures);	
	// Number of columns in total. Content cols + seperators.	
	
	document.writeln("<tr>");
	for(var i = 0; i < numberOfFeatures; i++)
	{		
		document.writeln('<td width="' + percentPerFeature + '%"><img src="http://download.interscience.wiley.com/images/dot.clear.gif" width="100%" height="1" border="0" alt="blank" /></td>');
	}
	document.writeln("</tr>");
}

function old_equalizeColumnWidth(numFeatures)
{
	var numberOfFeatures = numFeatures;		
	// Percentage width of table to use for each column.
	var percentPerFeature = Math.floor(100 / numberOfFeatures);	
	// Number of columns in total. Content cols + seperators.	
	
	if(debug)
	{
		alert("Number of feature boxes: " + numberOfFeatures + "\nPercent per feature: " + percentPerFeature);
	}
	
	document.writeln("<tr>");
	for(var i = 0; i < numberOfFeatures; i++)
	{		
		if (netscape4 == false)
		{
			document.writeln('<td style="width: ' + percentPerFeature + '%"><img src="http://download.interscience.wiley.com/images/dot.clear.gif" width="1" height="1" border="0" alt="blank" /></td>');
		}
		else // protect against inline style application hanging NN4.
		{
			document.writeln('<td><img src="http://download.interscience.wiley.com/images/dot.clear.gif" width="1" height="1" border="0" alt="blank" /></td>');		
		}
	}
	document.writeln("<tr>");
}

function writeFBoxCell()
{
	if(first)
	{
		document.write('<td valign="top" id="firstWideFBoxCell">');
	}else
	{
		document.write('<td valign="top" id="wideFBoxCell">');
	}
	numFeatures ++;
}


//
// escape apostrophe characters within a string
//
function encode(str)
{
        out = '';

        for (a = 0; a < str.length; a++)
        {
                c = str.charAt(a);

                if (c == "'")
                {
                        out += '\\';
                }

                out += c;
        }

        return out;
}


//
//
//
function escapeEntities(str)
{
	while (str.indexOf("&apos;") > -1)
	{
		pos = str.indexOf("&apos;");
		str = str.substr(0, pos) + '\\\'' + str.substr(pos + 6);
	}

	return str;
}


// new popup function less intrusive just uses the DOM to pickup links with an exwin class.
// currently implemented for Figure popups on D&T homepage.

function exLinks()
{
	if (document.getElementById)
	{
    	var aObject = document.getElementsByTagName("a");
    	for (var x=0; x<aObject.length; x++)
    	{				
    		if (aObject[x].className == "exwin")
    		{
    			aObject[x].onclick = function()
    			{
    				
    				//if we direct through "jabout" the page will get templated, we dont want that so we're gonna use "hompages"
    				this.href = String(this.href).toLowerCase().replace("cgi-bin/jabout", "homepages");
    				window.open(this.href, "Figures", "dependent=0,toolbar=1,location=0,status=0,menubar=0,scrollbars=1,resizable=1,width=600,height=400");
    				return false;
    			}
    		}
    	}
	}
}


/*
* Andy Perry
* JavaScript enhancements
*/

// One variable to act as global container for all js activity
if(typeof WIS=="undefined") {
	var WIS={
		author:"Andy Perry",
		creationDate:"31/08/2007"
	};
};

WIS.FunctionStack = function() {
	this.stackArray=[];	
};

WIS.FunctionStack.prototype = {
	addCall:function(func) {
		this.stackArray[this.stackArray.length]=func;
	},
	executeStackCalls:function() {
		for(var i=0; i<this.stackArray.length; i++) {
			this.stackArray[i]();
			this.stackArray.splice(i--,1);
		}
	}
};

if(typeof WIS.debug=="undefined") {
	WIS.debug={};
}; 

WIS.debug.XslDebug=function() {
	var allElementsColl=[];

	var allColl=document.getElementsByTagName("*");
	for(var i=0;i<allColl.length;i++) {
		if(allColl[i].getAttribute("xsldebug")!=null) {
			allColl[i].style.border="3px solid red";
			allColl[i].style.position="relative";
			var labelDiv=document.createElement("DIV");
			allColl[i].appendChild(labelDiv);
			var labelDivStyles={backgroundColor:"#999999",border:"2px solid yellow",position:"absolute",top:"0",left:"0",color:"#000000"};
			for(a in labelDivStyles) {
				labelDiv.style[a]=labelDivStyles[a];
			};
			labelDiv.innerHTML="something: "+allColl[i].getAttribute("xsldebug").substr(0,allColl[i].getAttribute("xsldebug").indexOf("::"));
		}
	}
}


function addTitle(oid,salesModelId) {
	http.open("POST", "/cart/managesubscription?oid="+oid+"&action=add&displayCart=false&salesModelId="+salesModelId, true); 
	
	http.onreadystatechange=function() {
		if(http.readyState == 4) {
			document.getElementById('cart').innerHTML='Title added to My Cart'; 
	    	toggleShCrtLink();
	    }
	}
	http.send(null);
	
};

