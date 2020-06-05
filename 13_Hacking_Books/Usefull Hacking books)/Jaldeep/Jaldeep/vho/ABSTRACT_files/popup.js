	function popup(page)
	{
		var hwnd = window.open(page, "Info", "alwaysRaised=1,dependent=0,toolbar=1,location=1,status=1,menubar=1,scrollbars=1,resizable=1,width=550,height=300,left=1,top=2,screenX=1,screenY=1");
		hwnd.focus();			// to bring the popup window to the front if it's already showing
	}	

	function graphpopup(page, pagename)
	{
		var hwnd = window.open("", pagename, "alwaysRaised=1,toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=1,width=550,height=330,left=1,top=2,screenX=1,screenY=1");				
		hwnd.document.writeln('<html>');
		hwnd.document.writeln('<head><title>Graphical Abstract Full Size Image</title></head>');
		hwnd.document.writeln('<body>');
		hwnd.document.writeln('<img src="'+page+'">');
		hwnd.document.writeln('<br>');
		hwnd.document.writeln('<a href="javascript:window.close();">Close Window</a>');
		hwnd.document.writeln('</body>');
		hwnd.document.writeln('</html>');
		hwnd.document.close();
		hwnd.focus();	// to bring the popup window to the front if it's already showing
	}
