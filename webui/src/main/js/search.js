class SearchStatus {
	constructor(xmlNode) {
		this.revision = xmlNode.getElementsByTagName("Revision")[0].childNodes[0].nodeValue
		this.query = xmlNode.getElementsByTagName("Query")[0].childNodes[0].nodeValue
		this.uuid = xmlNode.getElementsByTagName("uuid")[0].childNodes[0].nodeValue
		this.senders = xmlNode.getElementsByTagName("Senders")[0].childNodes[0].nodeValue
		this.results = xmlNode.getElementsByTagName("Results")[0].childNodes[0].nodeValue
	}
}

class SearchBySender {
	constructor(xmlNode) {
		this.resultBatches = new Map();
		
		var resultsBySender = xmlNode.getElementsByTagName("ResultsBySender")[0];
		var resultsFromSenders = resultsBySender.getElementsByTagName("ResultsFromSender");
		var i;
		for (i = 0; i < resultsFromSenders.length; i++) {
			var results = new ResultsBySender(resultsFromSenders[i]);
			this.resultBatches.set(results.sender, results);
		}
	}
}

class SearchByFile {
	constructor(xmlNode) {
		this.resultBatches = new Map();
		
		var resultsByFile = xmlNode.getElementsByTagName("ResultsByFile")[0];
		var resultsForFile = resultsByFile.getElementsByTagName("ResultsForFile");
		var i;
		for (i = 0; i < resultsForFile.length; i++) {
			var results = new ResultsByFile(resultsForFile[i]);
			this.resultBatches.set(results.infoHash, results);
		}
	}
}

class ResultsBySender {
	constructor(xmlNode) {
		this.sender = xmlNode.getElementsByTagName("Sender")[0].childNodes[0].nodeValue;
		this.senderB64 = xmlNode.getElementsByTagName("SenderB64")[0].childNodes[0].nodeValue;
		this.browse = xmlNode.getElementsByTagName("Browse")[0].childNodes[0].nodeValue;
		this.browsing = xmlNode.getElementsByTagName("Browsing")[0].childNodes[0].nodeValue;
		this.trust = xmlNode.getElementsByTagName("Trust")[0].childNodes[0].nodeValue;
		this.results = new Map();
		var resultNodes = xmlNode.getElementsByTagName("Result");
		var i;
		for (i = 0 ; i < resultNodes.length; i ++) {
			var result = new ResultBySender(resultNodes[i]);
			this.results.set(result.infoHash,result);
		}
	}
	
	getTrustLinks() {
		if (this.trust == "NEUTRAL")
			return this.getTrustLink() + this.getDistrustLink()
		else if (this.trust == "TRUSTED")
			return this.getNeutralLink() + this.getDistrustLink()
		else
			return this.getTrustLink() + this.getNeutralLink()
	}
	
	getTrustLink() {
		return "<span id='trusted-link-" + this.senderB64 + "'>" +
				"<a href='#' onclick='window.markTrusted(\"" + 
				this.senderB64 + "\"); return false;'>" + _t("Mark Trusted") + "</a></span><span id='trusted-" + 
				this.senderB64 + "'></span>"
	}
	
	getNeutralLink() {
		return "<a href'#' onclick='window.markNeutral(\"" + this.senderB64 + "\"); return false;'>" + _t("Mark Neutral") + "</a>"
	}
	
	getDistrustLink() {
		return "<span id='distrusted-link-" + this.senderB64 + "'>" +
				"<a href='#' onclick='window.markDistrusted(\"" + 
				this.senderB64 + "\"); return false;'>" + _t("Mark Distrusted") + "</a></span><span id='distrusted-" + 
				this.senderB64 + "'></span>"
	}
}

class ResultsByFile {
	constructor(xmlNode) {
		this.name = xmlNode.getElementsByTagName("Name")[0].childNodes[0].nodeValue;
		this.infoHash = xmlNode.getElementsByTagName("InfoHash")[0].childNodes[0].nodeValue;
		this.size = xmlNode.getElementsByTagName("Size")[0].childNodes[0].nodeValue;
		this.downloading = xmlNode.getElementsByTagName("Downloading")[0].childNodes[0].nodeValue;
		this.results = new Map();
		var resultNodes = xmlNode.getElementsByTagName("Result");
		var i;
		for (i = 0; i < resultNodes.length; i++) {
			var result = new ResultByFile(resultNodes[i]);
			this.results.set(result.sender, result);
		}
	}
}

class ResultBySender {
	constructor(xmlNode) {
		this.name = xmlNode.getElementsByTagName("Name")[0].childNodes[0].nodeValue;
		this.size = xmlNode.getElementsByTagName("Size")[0].childNodes[0].nodeValue;
		this.infoHash = xmlNode.getElementsByTagName("InfoHash")[0].childNodes[0].nodeValue;
		this.downloading = xmlNode.getElementsByTagName("Downloading")[0].childNodes[0].nodeValue;
		this.comment = null;
		var comment = xmlNode.getElementsByTagName("Comment")
		if (comment.length == 1) 
			this.comment = comment[0].childNodes[0].nodeValue;
		this.certificates = xmlNode.getElementsByTagName("Certificates")[0].childNodes[0].nodeValue
	}
	
	getCertificatesBlock() {
		if (this.certificates == "0")
			return ""
		var linkText = _t("View {0} Certificates", this.certificates)
		var link = "<a href='#' onclick='window.viewCertificatesBySender(\"" + this.infoHash + "\",\"" + this.certificates + "\");return false;'>" + 
			linkText + "</a>"
		var id = senderB64 + "_" + this.infoHash
		var html = "<div id='certificates-link-" + id +"'>" + link + "</div><div id='certificates-" + id +"'></div>"
		return html
	}
}

class ResultByFile {
	constructor(xmlNode) {
		this.sender = xmlNode.getElementsByTagName("Sender")[0].childNodes[0].nodeValue;
		this.senderB64 = xmlNode.getElementsByTagName("SenderB64")[0].childNodes[0].nodeValue;
		this.browse = xmlNode.getElementsByTagName("Browse")[0].childNodes[0].nodeValue;
		this.browsing = xmlNode.getElementsByTagName("Browsing")[0].childNodes[0].nodeValue;
		this.trust = xmlNode.getElementsByTagName("Trust")[0].childNodes[0].nodeValue;
		this.comment = null;
		var comment = xmlNode.getElementsByTagName("Comment")
		if (comment.length == 1) 
			this.comment = comment[0].childNodes[0].nodeValue;
		this.certificates = xmlNode.getElementsByTagName("Certificates")[0].childNodes[0].nodeValue
	}
	
	getCertificatesBlock() {
		if (this.certificates == "0")
			return ""
		var linkText = _t("View {0} Certificates", this.certificates)
		var link = "<a href='#' onclick='window.viewCertificatesByFile(\"" + this.senderB64 + "\",\"" + this.certificates + "\");return false;'>" + linkText + "</a>"
		var id = this.senderB64 + "_" + infoHash
		var html = "<div id='certificates-link-" + id +"'>" + link + "</div><div id='certificates-" + id +"'></div>"
		return html
	}
	
	getTrustLinks() {
		if (this.trust == "NEUTRAL")
			return this.getTrustLink() + this.getDistrustLink()
		else if (this.trust == "TRUSTED")
			return this.getNeutralLink() + this.getDistrustLink()
		else
			return this.getTrustLink() + this.getNeutralLink()
	}
	
	getTrustLink() {
		return "<span id='trusted-link-" + this.senderB64 + "'>" +
				"<a href='#' onclick='window.markTrusted(\"" + 
				this.senderB64 + "\"); return false;'>" + _t("Mark Trusted") + "</a></span><span id='trusted-" + 
				this.senderB64 + "'></span>"
	}
	
	getNeutralLink() {
		return "<a href'#' onclick='window.markNeutral(\"" + this.senderB64 + "\"); return false;'>" + _t("Mark Neutral") + "</a>"
	}
	
	getDistrustLink() {
		return "<span id='distrusted-link-" + this.senderB64 + "'>" +
				"<a href='#' onclick='window.markDistrusted(\"" + 
				this.senderB64 + "\"); return false;'>" + _t("Mark Distrusted") + "</a></span><span id='distrusted-" + 
				this.senderB64 + "'></span>"
	}
}

class Certificate {
	constructor(xmlNode) {
		this.issuer = xmlNode.getElementsByTagName("Issuer")[0].childNodes[0].nodeVlue
		this.name = xmlNode.getElementsByTagName("Name")[0].childNodes[0].nodeVlue
		this.comment = null
		try {
			this.comment = xmlNode.getElementsByTagName("Comment")[0].childNodes[0].nodeVlue
		} catch(ignore) {}
		this.timestamp = xmlNode.getElementsByTagName("Timestamp")[0].childNodes[0].nodeVlue
		this.base64 = xmlNode.getElementsByTagName("Base64")[0].childNodes[0].nodeVlue
	}
	
	renderRow() {
		var commentPresent = "false"
		if (this.comment != null)
			commentPresent = "true"
		
		var html = "<tr>"
		html += "<td>" + this.issuer + "</td>"
		html += "<td>" + this.name + "</td>"
		html += "<td>" + commentPresent + "</td>"
		html += "<td>" + this.timestamp + "</td>"
		html += "</tr>"
		return html
	}
}

class CertificateResponse {
	constructor(xmlNode) {
		this.status = xmlNode.getElementsByTagName("Status")[0].childNodes[0].nodeValue
		this.total = xmlNode.getElementsByTagName("Total")[0].childNodes[0].nodeValue
		
		var certNodes = xmlNode.getElementsByTagName("Certificates")[0].getElementsByTagName("Certificate")
		var i
		this.certificates = []
		for (i = 0; i < certNodes.length; i++) {
			certificates.push( new Certificate(certNodes[i]))
		}
	}
	
	renderTable() {
		var html = _t("Status") + "  " + this.status
		if (this.certificates.length == 0)
			return html
		
		html += "  "
		html += _t("Certificates") + "  " + this.certificates.length + "/" + this.total
		 
		var headers = [_t("Issuer"), _t("Name"), _t("Comment"), _t("Timestamp")]
		html += "<br/>"
		html += "<table><thead><tr><th>" + headers.join("</th><th>") + "</th></thead><tbody>"
		var i
		for(i = 0; i < this.certificates.length; i++) {
			html += this.certificates[i].renderRow()
		}
		html += "</tbody></table>"
		
		return html
	}
}

class CertificateFetch {
	constructor(senderB64, fileInfoHash) {
		this.senderB64 = senderB64
		this.fileInfoHash = fileInfoHash
		this.divId = senderB64 + "_" + fileInfoHash
	}
	
	updateTable() {
		var xmlhttp = new XMLHttpRequest()
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				
				var block = document.getElementById("certificates-" + this.divId)
			}			
		}
		xmlhttp.open("GET", "/MuWire/Certificate", true)
		xmlhttp.send()
	}
}

var statusByUUID = new Map()
var currentSearchBySender = null
var currentSearchByFile = null
var currentSender = null
var currentFile = null
var expandedComments = new Map();
var certificateFetches = new Map()

var uuid = null;
var sender = null;
var senderB64 = null
var lastXML = null;
var infoHash = null;

function showCommentBySender(divId, spanId) {
	var split = divId.split("_");
	var commentDiv = document.getElementById(divId);
	var comment = "<pre>"+ currentSearchBySender.resultBatches.get(split[2]).results.get(split[3]).comment + "</pre>";
	commentDiv.innerHTML = comment
	expandedComments.set(divId, comment);
	var hideLink = "<a href='#' onclick='window.hideComment(\""+divId+"\",\""+spanId+"\",\"Sender\");return false;'>" + _t("Hide Comment") + "</a>";
    var linkSpan = document.getElementById(spanId);
	linkSpan.innerHTML = hideLink;
}

function showCommentByFile(divId, spanId) {
	var split = divId.split("_");
	var commentDiv = document.getElementById(divId);
	var comment = "<pre>"+currentSearchByFile.resultBatches.get(split[2]).results.get(split[3]).comment + "</pre>";
	commentDiv.innerHTML = comment
	expandedComments.set(divId, comment);
	var hideLink = "<a href='#' onclick='window.hideComment(\""+divId+"\",\""+spanId+"\",\"File\");return false;'>" + _t("Hide Comment") + "</a>";
    var linkSpan = document.getElementById(spanId);
	linkSpan.innerHTML = hideLink;
}

function hideComment(divId, spanId, byFile) {
	expandedComments.delete(divId);
	var commentDiv = document.getElementById(divId);
	commentDiv.innerHTML = ""
	var showLink = "<a href='#' onclick='window.showCommentBy"+byFile+"(\"" + divId + "\",\"" + spanId + "\"); return false;'>" + _t("Show Comment") + "</a>";
	var linkSpan = document.getElementById(spanId);
	linkSpan.innerHTML = showLink;
}

function download(resultInfoHash) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resultSpan = document.getElementById("download-"+resultInfoHash);
			resultSpan.innerHTML = _t("Downloading");
		}
	}
	xmlhttp.open("POST", "/MuWire/Download", true);
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send(encodeURI("action=start&infoHash="+resultInfoHash+"&uuid="+uuid));
}

function markTrusted(host) {
	var linkSpan = document.getElementById("trusted-link-"+host)
	linkSpan.innerHTML = ""
	
	var textAreaSpan = document.getElementById("trusted-"+host)
	
	var textbox = "<textarea id='trust-reason-" + host + "'></textarea>"
	var submitLink = "<a href='#' onclick='window.submitTrust(\"" + host + "\");return false;'>" + _t("Submit") + "</a>"
	var cancelLink = "<a href='#' onclick='window.cancelTrust(\"" + host + "\");return false;'>" + _t("Cancel") + "</a>"
	
	var html = "<br/>Enter Reason (Optional)<br/>" + textbox + "<br/>" + submitLink + " " + cancelLink + "<br/>"
	
	textAreaSpan.innerHTML = html
}

function markNeutral(host) {
	publishTrust(host, "", "neutral")
}

function markDistrusted(host) {
	var linkSpan = document.getElementById("distrusted-link-"+host)
	linkSpan.innerHTML = ""
	
	var textAreaSpan = document.getElementById("distrusted-"+host)
	
	var textbox = "<textarea id='distrust-reason-" + host + "'></textarea>"
	var submitLink = "<a href='#' onclick='window.submitDistrust(\"" + host + "\");return false;'>" + _t("Submit") + "</a>"
	var cancelLink = "<a href='#' onclick='window.cancelDistrust(\"" + host + "\");return false;'>" + _t("Cancel") + "</a>"
	
	var html = "<br/>Enter Reason (Optional)<br/>" + textbox + "<br/>" + submitLink + " " + cancelLink + "<br/>"
	
	textAreaSpan.innerHTML = html
}

function submitTrust(host) {
	var reason = document.getElementById("trust-reason-"+host).value
	publishTrust(host, reason, "trust")
}

function submitDistrust(host) {
	var reason = document.getElementById("trust-reason-"+host).value
	publishTrust(host, reason, "distrust")
}

function cancelTrust(host) {
	var textAreaSpan = document.getElementById("trusted-" + host)
	textAreaSpan.innerHTML = ""
	
	var linkSpan = document.getElementById("trusted-link-"+host)
	var html = "<a href='#' onclick='markTrusted(\"" + host + "\"); return false;'>" + _t("Mark Trusted") + "</a>"
	linkSpan.innerHTML = html
}

function cancelDistrust(host) {
	var textAreaSpan = document.getElementById("distrusted-" + host)
	textAreaSpan.innerHTML = ""
	
	var linkSpan = document.getElementById("distrusted-link-"+host)
	var html = "<a href='#' onclick='markDistrusted(\"" + host + "\"); return false;'>" + _t("Mark Distrusted") + "</a>"
	linkSpan.innerHTML = html
}

function publishTrust(host, reason, trust) {
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if (refreshType == "Sender")
				refreshGroupBySender(uuid)
			else if (refreshType == "File")
				refreshGroupByFile(uuid)
		}
	}
	xmlhttp.open("POST","/MuWire/Trust", true)
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send("action=" + trust + "&reason=" + reason + "&persona=" + host)
}

function updateSender(senderName) {
	sender = senderName;
	
	var resultsFromSpan = document.getElementById("resultsFrom");
	resultsFromSpan.innerHTML = _t("Results From {0}", sender);
	
	var resultsDiv = document.getElementById("bottomTable");
	var table = "<table><thead><tr><th>" + _t("Name") + "</th><th>" + _t("Size") + "</th><th>" + _t("Download") + "</th></tr></thead><tbody>"
	var x = currentSearchBySender
	var senderBatch = x.resultBatches.get(sender)
	senderB64 = senderBatch.senderB64
	x = senderBatch.results;
	for (var [resultInfoHash, result] of x) {
		table += "<tr>";
		table += "<td>";
		table += result.name;
		if (result.comment != null) {
			var divId = "comment_" + uuid + "_" + senderName + "_" + resultInfoHash;
			var spanId = "comment-link-"+resultInfoHash + senderName + uuid;
			var comment = expandedComments.get(divId);
			if (comment != null) {
				var link = "<a href='#' onclick='window.hideComment(\""+divId +"\",\"" + spanId + "\",\"Sender\");return false;'>" + _t("Hide Comment") + "</a>";
				table += "<br/><span id='"+spanId+"'>" + link + "</span><br/>";
				table += "<div id='" + divId + "'>"+comment+"</div>";				
			} else {
				var link = "<a href='#' onclick='window.showCommentBySender(\"" + divId +
					"\",\""+spanId+"\");"+
					"return false;'>" + _t("Show Comment") + "</a>"; 			
				table += "<br/><span id='"+spanId+"'>"+link+"</span>";
				table += "<div id='"+divId+"'></div>";
			}
		}
		table += result.getCertificatesBlock()
		table += "</td>";
		table += "<td>";
		table += result.size;
		table += "</td>";
		table += "<td>";
		if (result.downloading == "false") {
			table += "<span id='download-"+ resultInfoHash+"'><a href='#' onclick='window.download(\"" + resultInfoHash + "\");return false;'>" + _t("Download") + "</a></span>";
		} else {
			table += _t("Downloading");
		}
		table += "</td>";
		table += "</tr>";
	}
	table += "</tbody></table>";
	if (x.size > 0)
		resultsDiv.innerHTML = table;
}

function updateFile(fileInfoHash) {
	infoHash = fileInfoHash;
	
	var searchResults = currentSearchByFile.resultBatches.get(infoHash);
	
	var resultsFromSpan = document.getElementById("resultsFrom");
	resultsFromSpan.innerHTML = "Results For "+searchResults.name;
	
	var resultsDiv = document.getElementById("bottomTable");
	var table = "<table><thead><tr><th>" + _t("Sender") + "</th><th>" + _t("Browse") + "</th></tr></thead><tbody>";
	var i;
	for (var [senderName, result] of searchResults.results) {
		table += "<tr>";
		table += "<td>";
		table += senderName
		if (result.comment != null) {
			var divId = "comment_" + uuid + "_" + fileInfoHash + "_" + senderName;
			var spanId = "comment-link-" + fileInfoHash + senderName + uuid;
			var comment = expandedComments.get(divId);
			if (comment != null) {
				var link = "<a href='#' onclick='window.hideComment(\""+divId +"\",\"" + spanId + "\",\"File\");return false;'>" + _t("Hide Comment") + "</a>";
				table += "<br/><span id='"+spanId+"'>" + link + "</span><br/>";
				table += "<div id='" + divId + "'>"+comment+"</div>";
			} else {
				var link = "<a href='#' onclick='window.showCommentByFile(\"" + divId +
					"\",\""+spanId+"\");"+
					"return false;'>" + _t("Show Comment") + "</a>"; 			
				table += "<br/><span id='"+spanId+"'>"+link+"</span>";
				table += "<div id='"+divId+"'></div>";
			}
		}
		table += result.getCertificatesBlock()
		table += "</td>";
		if (result.browse == "true") {
			if (result.browsing == "true")
				table += "<td>" + _t("Browsing") + "</td>"
			else {
				table += "<td><span id='browse-link-" + result.senderB64 + "'>" + getBrowseLink(result.senderB64) + "</span></td>"
			}
		}
		table += "<td>" + result.trust + " " + result.getTrustLinks() + "</td>"
		table += "</tr>";
	}
	table += "</tbody></table>";
	if (searchResults.results.size > 0)
		resultsDiv.innerHTML = table;
}			

function updateUUIDBySender(resultUUID) {
	uuid = resultUUID;
	
	var currentStatus = statusByUUID.get(uuid)
	
	var currentSearchSpan = document.getElementById("currentSearch");
	currentSearchSpan.innerHTML = currentStatus.query + " Results";
	
	var sendersDiv = document.getElementById("topTable");
	var table = "<table><thead><tr><th>" + _t("Sender") + "</th><th>" + _t("Browse") + "</th><th>" + _t("Trust") + "</th></tr></thead><tbody>";
	var x = currentSearchBySender.resultBatches;
	for (var [senderName, senderBatch] of x) {
		table += "<tr><td><a href='#' onclick='updateSender(\""+senderName+"\");return false;'>"
		table += senderName;
		table += "</a></td>";
		if (senderBatch.browse == "true") {
			if (senderBatch.browsing == "true") 
				table += "<td>" + _t("Browsing") + "</td>"
			else 
				table += "<td><span id='browse-link-" + senderBatch.senderB64 + "'>" + getBrowseLink(senderBatch.senderB64) + "</span></td>"
		} 
		table += "<td>" + senderBatch.trust + " "+senderBatch.getTrustLinks() + "</td>"
		table += "</tr>";
	}
	table += "</tbody></table>";
	if (x.size > 0)
		sendersDiv.innerHTML = table;
	if (sender != null)
		updateSender(sender);
}

function updateUUIDByFile(resultUUID) {
	uuid = resultUUID;
	
	var currentStatus = statusByUUID.get(uuid)
	
	var currentSearchSpan = document.getElementById("currentSearch");
	currentSearchSpan.innerHTML = _t("Results for {0}", currentStatus.query)
	
	var topTableDiv = document.getElementById("topTable");
	var table = "<table><thead><tr><th>" + _t("Name") + "</th><th>" + _t("Size") + "</th><th>" + _t("Download") + "</th></tr></thead><tbody>";
	var x = currentSearchByFile.resultBatches;
	for (var [fileInfoHash, file] of x) {
		table += "<tr><td><a href='#' onclick='updateFile(\""+fileInfoHash+"\");return false;'>";
		table += file.name;
		table += "</a></td>";
		table += "<td>";
		table += file.size;
		table += "</td>";
		table += "<td>";
		if (file.downloading == "false") 
			table += "<span id='download-"+fileInfoHash+"'><a href='#' onclick='window.download(\""+fileInfoHash+"\"); return false;'>" + _t("Download") + "</a></span>";
		else
			table += _t("Downloading");
		table += "</td></tr>";
	}
	table += "</tbody></table>";
	if (x.size > 0) 
		topTableDiv.innerHTML = table;
	if (infoHash != null)
		updateFile(infoHash);
}

function refreshGroupBySender(searchUUID) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var xmlDoc = this.responseXML;
			currentSearchBySender = new SearchBySender(xmlDoc)
			updateUUIDBySender(searchUUID);
		}
	}
	xmlhttp.open("GET", "/MuWire/Search?section=groupBySender&uuid="+searchUUID, true);
	xmlhttp.send();
}

function refreshGroupByFile(searchUUID) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var xmlDoc = this.responseXML;
			
			currentSearchByFile = new SearchByFile(xmlDoc)
			updateUUIDByFile(searchUUID)
		}
	}
	xmlhttp.open("GET", "/MuWire/Search?section=groupByFile&uuid="+searchUUID, true);
	xmlhttp.send();
}

function getBrowseLink(host) {
	return "<a href='#' onclick='window.browse(\"" + host + "\"); return false;'>" + _t("Browse") + "</a>"
}

function browse(host) {
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var linkSpan = document.getElementById("browse-link-"+host)
			linkSpan.innerHTML = _t("Browsing");
		}
	}
	xmlhttp.open("POST", "/MuWire/Browse", true)
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send("action=browse&host="+host)
}

function viewCertificatesByFile(fileSenderB64, count) {
	var fetch = new CertificateFetch(fileSenderB64, infoHash)
	certificateFetches.set(fetch.divId, fetch)
	
	var linkSpan = document.getElementById("certificates-link-" + fetch.divId)
	var hideLink = "<a href='#' onclick='window.hideCertificatesByFile(\"" + fileSenderB64 + "\",\"" + count + "\");return false;'>" + _t("Hide Certificates") + "</a>"
	linkSpan.innerHTML = hideLink
	
	var fetchSpan = document.getElementById("certificates-" + fetch.divId)
	fetchSpan.innerHTML = _t("Fetching Certificates")
}

function hideCertificatesByFile(fileSenderB64, count) {
	var id = fileSenderB64 + "_" + infoHash
	certificateFetches.delete(id)  // TODO: propagate cancel to core
	
	var fetchSpan = document.getElementById("certificates-" + id)
	fetchSpan.innerHTML = ""
	
	var linkSpan = document.getElementById("certificates-link-" + id)
	var linkText = _t("View {0} Certificates", count)
	var showLink = "<a href='#' onclick='window.viewCertificatesByFile(\"" + fileSenderB64 + "\",\"" + count + "\");return false;'>" + linkText + "</a>"
	linkSpan.innerHTML = showLink
}

function viewCertificatesBySender(fileInfoHash, count) {
	var fetch = new CertificateFetch(senderB64, fileInfoHash)
	certificateFetches.set(fetch.divId, fetch)
	
	var linkSpan = document.getElementById("certificates-link-" + fetch.divId)
	var hideLink = "<a href='#' onclick='window.hideCertificatesBySender(\"" + fileInfoHash + "\",\"" + count + "\");return false;'>" +
		_t("Hide Certificates") + "</a>"
	linkSpan.innerHTML = hideLink
	
	var fetchSpan = document.getElementById("certificates-" + fetch.divId)
	fetchSpan.innerHTML = _t("Fetching Certificates")
}

function hideCertificatesBySender(fileInfoHash, count) {
	var id = senderB64 + "_" + fileInfoHash
	certificateFetches.delete(id) // TODO: propagate cancel to core
	
	var fetchSpan = document.getElementById("certificates-" + id)
	fetchSpan.innerHTML = ""
	
	var linkSpan = document.getElementById("certificates-link-" + id)
	var linkText = _t("View {0} Certificates", count)
	var showLink = "<a href='#' onclick='window.viewCertificatesBySender(\"" + fileInfoHash + "\",\"" + count + "\");return false;'>" +
		linkText + "</a>"
	linkSpan.innerHTML = showLink
}

function refreshStatus() {
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var currentSearch = null
			if (uuid != null)
				currentSearch = statusByUUID.get(uuid)
			statusByUUID.clear()
			
			var activeSearches = this.responseXML.getElementsByTagName("Search")
			var i
			for(i = 0; i < activeSearches.length; i++) {
				var searchStatus = new SearchStatus(activeSearches[i])
				statusByUUID.set(searchStatus.uuid, searchStatus)
			}
			
			
			var table = "<table><thead><tr><th>" + _t("Query") + "</th><th>" + _t("Senders") + "</th><th>" + _t("Results") + "</th></tr></thead><tbody>"
			for (var [searchUUID, status] of statusByUUID) {
				table += "<tr>"
				table += "<td>" + "<a href='#' onclick='refreshGroupBy" + refreshType + "(\"" + searchUUID + "\");return false;'>" + status.query + "</a></td>"
				table += "<td>" + status.senders + "</td>"
				table += "<td>" + status.results + "</td>"
				table += "</tr>"
			}
			table += "</tbody></table>"
			
			var activeDiv = document.getElementById("activeSearches")
			activeDiv.innerHTML = table
			
			if (uuid != null) {
				var newStatus = statusByUUID.get(uuid)
				if (newStatus.revision > currentSearch.revision)
					refreshFunction(uuid)
			}
		}
	}
	xmlhttp.open("GET", "/MuWire/Search?section=status", true)
	xmlhttp.send()
}

var refreshFunction = null
var refreshType = null

function initGroupBySender() {
	refreshFunction = refreshGroupBySender
	refreshType = "Sender"
	setInterval(refreshStatus, 3000);
	setTimeout(refreshStatus, 1);
}

function initGroupByFile() {
	refreshFunction = refreshGroupByFile
	refreshType = "File"
	setInterval ( refreshStatus, 3000);
	setTimeout ( refreshStatus, 1);
}
