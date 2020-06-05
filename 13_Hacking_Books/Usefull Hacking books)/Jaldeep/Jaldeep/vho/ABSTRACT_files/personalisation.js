/*
* Project				:	Interscience Redesign
* File					:	personalisation.js
* Creation Date			:	25th March 2003
* Author				:	Jonathan Sugar
*
* Various functions to deliver personalisation functionality.
*/

// Pre-declare userName so it's available when we need to test if the page
// assembler ran OK
var userName = null;
var shcrtCookie = null;

// Browser detect globals:
var uaStr = navigator.userAgent.toLowerCase();
var uaVer = parseInt(navigator.appVersion);
// for detecting netscape 4
var netscape = (uaStr.indexOf("mozilla") > -1);
var netscape4 = (netscape && uaVer < 5);

// Factory Methods

// Simple wraper object to encapsulate the data for a co-branding item.
function coBrandingItem(image, imageAltText, href)
{
	//alert("Making new coBrandingItem:\nImage: " + image + "\nimageAltText" + imageAltText + "\nhref: " + href);
	this.image = image;
	this.imageAltText = imageAltText;
	this.href = href;
}

/*
* Insert the 'Customer co-branding' section.
* -----------------------------
*
* Author: Jonathan Sugar, March 2003.
*
* 1.	Insert customer co branding. Loop through 'customerCoBranding' array
* 		inserting XHTML where needed.
*
* NOTE: the array contains ONLY the resource location (the location of a gif
* on the file system), the required XHTML is then added where needed. This way
* we maintain the seperation between presentation and content.
*/
function insertCustomerCoBranding(maxBranding)
{
	if( customerCoBranding[0].image != "none")
	{
		document.writeln('<div id="providedBy" class="item">');
		document.writeln('<h5><img src="http://download.interscience.wiley.com/images/txt.provided-by.gif" width="71" height="16" alt="provided by" border="0" /></h5>');
		document.writeln('<ul class="noBullet">');

		var i;
		//Change start for bug#2288
		if(typeof(maxBranding) == "undefined" | maxBranding == "" | maxBranding == 0){
			maxBranding = 3; // DEFAULT Value for No of Cobranding dispaly
		}
		var size = customerCoBranding.length;
		if(maxBranding != -1 & size-1 > maxBranding){
			size = maxBranding;
		}
		//Change End for bug#2288

		// Add the co-branding images o the page.
		//for(i=0; i < customerCoBranding.length; i++ )
		for(i=0; i < size; i++ )
		{
			// ignore the terminating array element.
			if(customerCoBranding[i].image == "none")
			{
				continue;
			}

			this.image = customerCoBranding[i].image;
			this.imageAltText = customerCoBranding[i].imageAltText;
			this.href = customerCoBranding[i].href;

			if (image == "")
			{
				if(href == "")
				{
					document.writeln('<li>' + imageAltText + '</li>');
				}
				else
				{
					document.writeln('<li><a href="' + href + '">' + imageAltText + '</a></li>');
				}
			}
			else
			{
				if(href == "")
				{
					document.writeln('<li><img src="' + image + '" alt="' + imageAltText + '" border="0" /></li>');
				}
				else
				{
					document.writeln('<li><a href="' + href + '"><img src="' + image + '" alt="' + imageAltText + '" border="0" /></a></li>');
				}
			}
		}

		// If there are more co-branding images add in a link to them.
		// Changes made for Bug#2288
		//if(moreCustomerCoBranding == "true")
		if(maxBranding != -1 & customerCoBranding.length-1 > maxBranding)
		{
			document.writeln('<li><a href="/cgi-bin/myprofile" class="linkMore">More Providers</a></li>');
		}

		document.writeln('</ul>');
		document.writeln('</div>');
		document.writeln('<div class="line"><img src="http://download.interscience.wiley.com/images/dot.CCC.gif" width="100%" height="1" alt="" border="0" /></div>');
	}
}

/*
* Insert the 'My Area' section.
* -----------------------------
*
* Author: Jonathan Sugar, March 2003.
* Updated: Ben Marvell, April 2006
*
* My profile link absolute as this file isnt only run from w3 anymore.
*/
function insertMyArea(userdata)
{
	// just in case the page assembler isn't running.
	
	
	if (userName != null)
	{
		document.writeln("<ul>");
		if(userName != "")
		{
			//write out the user specific data for the menu
			if (userdata != null){
				if (userName.length > 33){
					var writedata = "<li id=\"user\"><strong>" + userName.substring(0,33) + "...</strong>, access your</li>";
				} else {
					var writedata = "<li id=\"user\"><strong>" + userName + "</strong>, access your</li>";
				}

				for (var x=0; x<userdata.length; x++)
				{
					writedata += userdata[x];
				}
				document.writeln(writedata);
			}
			document.writeln(getShCrtLink(true));
		}
		else 
			document.writeln(getShCrtLink(false));
			
		toggleShCrtLink();
		document.writeln("<li><a href='/cgi-bin/myprofile' target='_top' class='menuSideArrow'>My Profile</a></li>");	
		document.writeln(getLoginOutLink());
		document.writeln("</ul>");
	}
	if (menuloadedflag){
		wisMenu();
	}
}

/*
* Insert the Customer Admin 'Login/Logout' link
* -----------------------------
*
* Author: Bobby Jack, December 2004.
*
*/
function insertAdminLink(page)
{
	val = getCookie("AID");
	
	if (val && val != "-1")
	{
		document.writeln('<li class="menuSideArrow" style="padding-left: 80px;"><a class="menuSideArrow" href="/cgi-bin/logoutcustadmin?Page=/cgi-bin/bookpicker">Logout</a></li>');
	}
	else
	{
		document.writeln('<li class="menuSideArrow" style="padding-left: 80px;"><a class="menuSideArrow" href="/cgi-bin/custnavlogin?TPL=customer-admin.customer&Page=' + page + '">Login</a></li>');
	}
}

/*
* Insert the username section.
* -----------------------------
*
* Author: Jonathan Sugar, March 2003.
*
* 1. Insert the username.
*/
function insertUserName()
{
	document.write(userName);
}

/*
* Return the appropriate link to the login/logout cgi
* ---------------------------------------------------
*
* Author: Jonathan Sugar, March 2003.
* Updated: Ben Marvell, April 2006
* Had to change the links absolute as this file isnt only run from w3 anymore.
*/
function getLoginOutLink()
{
	if(userName != "")
	{
		return "<li><a href='/cgi-bin/logout' target='_top' class='menuSideArrow'>Log Out</a></li>";
	}else
	{
		return "<li><a href='/' target='_top' class='menuSideArrow'>Log In</a></li>";
	}
}

/*
* Return the appropriate link to the shopping cart content page
* ---------------------------------------------------
*
* Author: Zhiming & Warrell June 2007
*/
function getShCrtLink(logged)
{
	if(logged == true )
		return "<li><div ID='shcrt_id'><a href='/cart/shoppingcart' target='_top' class='menuSideArrow'><img src='http://download.interscience.wiley.com/images/cart.gif' border='0' align='absbottom'/>My Cart</a></div></li>";
	else
		return "<li id='mycart'><div ID='shcrt_id'><a href='/cart/shoppingcart' target='_top' class='menuSideArrow'><img src='http://download.interscience.wiley.com/images/cart.gif' border='0' align='absbottom'/>My Cart</a></div></li>";
}

function toggleShCrtLink()
{
	shcrtCookie = readCookie("SHCRT");
	if(shcrtCookie != null)
	{
		if(document.all)
		{
			return true;
		}
		else
		{
			document.getElementById("shcrt_id").style.display = "block";
		}
	}
	else
	{
		if(document.all)
		{
			return true;
		}
		else
		{
			document.getElementById("shcrt_id").style.display = "none";
		}
	}
}



function readCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

