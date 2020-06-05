// These are the JavaScript functions required for outbound linking from 
// Wiley InterScience. (AID April 2000)
// Approach copied from Andy's SFX js.
// ChrisNS 20020320 - added setEarlyView()

//version check
var version = 1;
var appname = "";
var artDOI = "";
var artEarlyView = "EVIEW=Y"; // EarlyView defaults to Y
var artEnableISI = "ENABLEISI=N"; //Enable ISI linking from journal articles
var artTurnOnCas = "ENABLECAS=Y"; // Turn on CAS linking
var artEnablePubMed = "ENABLEPM=Y"; // Turn on PubMed linking

if (navigator.appName.indexOf("Netscape") >= 0) { appname = "ns"; }
else if (navigator.appName.indexOf("Explorer") >= 0) { appname = "ie"; }
if (navigator.userAgent.indexOf("Mozilla/2") >= 0) {
	version = 2;
} else if (navigator.userAgent.indexOf("Mozilla/3") >= 0) {
	version = 3;
} else if (navigator.userAgent.indexOf("Mozilla/4") >= 0) {
	version = 4;
} else if (navigator.userAgent.indexOf("Mozilla/5") >= 0) {
	version = 5;
}

// Browser detect globals:
var uaStr = navigator.userAgent.toLowerCase();
var uaVer = parseInt(navigator.appVersion);
// for detecting netscape 4
var netscape = (uaStr.indexOf("mozilla") > -1);
var netscape4 = (netscape && uaVer < 5);

// Get the cookies named "REF_LNX and SRC_LNX"... deprecated for now. Always set.
// Instead set the hypertext for linking.
//var anchorString = '<img src="http://download.interscience.wiley.com/images/lnx.jpg" border=0 alt="extended services">';
var anchorString = 'Links';
var targString = ' target=_top';
var anchor2 = 'links';

//NEW for special content linking. Anchor string must be taken from SGML.
var contAnchor = '';

// Linking functions


//Get the EarlyView flag of the citing article which is needed to ensure that the link is suitable for ISI WoS.
// The CONTROL details are passed in, in the form -----. only grab the 2nd of 5 characters which is the EarlyView flag
function setEarlyView(object)
{
  if ((version >= 3) && (object.substring(1,2) != "Y"))
  {
   artEarlyView = "EVIEW=N"; 
  }
}

//Get the DOI of the citing article which is needed for the ISI links.
function setDOI(object){
  if (version >= 3)
  {
    artDOI = object;
  }
}

function setISSN(object)
{
}

// Print out the reference link. 
function print_link(object)
{
  if (version >= 3)
  {
    // remove "BIB" prefix from the value of BIBID (for ISI linking)
    // note, this could be performed in LNX. Need to reassess where this should be done.
    var re = new RegExp ('BIBID=BIB', 'i') ;
    var paramstring = new String();
    paramstring = object.replace(re, 'BIBID=');
     
    var unpCookie = '/cgi-bin/reflink?object=' + escape(paramstring + "&" + artDOI + "&" + artEarlyView + "&" + artEnableISI + "&" + artTurnOnCas + "&" + artEnablePubMed);
	if (netscape4 == false)
	{
    	document.write ('<a href=' + unpCookie + targString + '><span style="color: #369;">' + anchorString + '</span></a>&nbsp;&nbsp;');
	}
	else // protect against inline style application hanging NN4
	{
    	document.write ('<a href=' + unpCookie + targString + '><span>' + anchorString + '</span></a>&nbsp;&nbsp;');	
	}
  }
  else
  {
    document.writeln();
  }  
}

//Print out source links (in the citing article)
function print_SRClink(object){
  if (version >= 3)
  {
    var unpCookie = '/cgi-bin/srclink?object=' + escape(object);
    var url = unpCookie;
    document.write ('<li><font face="Arial, Helvetica" size=2>Find other ');
    document.write (anchor2.link(url));
    document.write (' for this article.</font></li>');
  }
  else
  {
    document.writeln();
  }  
}

// Links for journal citations
function print_JCIT(object)
{
    if (object.match(/JTL/) !=null)
    {
      print_link(object);  
    }  
}

// Links for book citations
function print_BKCIT(object){
}

// Links for electronic path citations
function print_EPATHCIT(object){
}

// Links for patent citations
function print_PATENTCIT(object){
}

// Links for standard citations
function print_STANDARDCIT(object){
}

// Links for other citations, e.g., theses, proceedings, personal communications
function print_OTHERCIT(object){
}

//NEW functions for special content linking. (AID Sept 5 2000)

// print an anchor with the specified text and calling linking program.

function print_contentlink_start(conttext, object)
{
  if (version >= 3)
  {
    if (object.match(/URL/) != null  || object.match(/ACC/) != null)
    {
      object = object + "&TEXT=" + conttext;
      var unpCookie = '/cgi-bin/contlink?object=' + escape(object);
      document.write ('<a href=' + unpCookie + targString + '>');
    }
  }
  document.writeln();
  
}

function print_contentlink_end(object)
{
  if (version >= 3)
  {
    if (object.match(/URL/) != null || object.match(/ACC/) != null)
    {
      document.write('</a>');
    }
  }  
  document.writeln();
  
}

