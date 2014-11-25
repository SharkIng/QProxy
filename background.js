function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

function useProxy(tab, proxy_url) {
    if (proxy_url) {
        var u = parseUri(tab.url);

		if (u['host'].match(proxy_url+'$') != proxy_url) {
			var newURL = u['protocol'] + '://' + u['host'] + '.' + proxy_url + u['relative'];
			
			chrome.tabs.update(tab.id, {
				url: newURL
			});
		}
    }
}

function tabListener(tabId, changeInfo, tab) {
    chrome.pageAction.show(tabId);
}

function pageListener(tab) {
					
    proxy_url = 'proxy.queensu.ca';
       
    useProxy(tab, proxy_url);
					
}


chrome.tabs.onUpdated.addListener(tabListener);

chrome.pageAction.onClicked.addListener(pageListener);