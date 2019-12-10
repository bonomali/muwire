class Result {
	constructor(name, size, comment, infoHash, downloading, certificates, hostB64) {
		this.name = name
		this.size = size
		this.infoHash = infoHash
		this.comment = comment
		this.downloading = downloading
		this.certificates = certificates
		this.hostB64 = hostB64
	}
	
	getCertificateBlock() {
		if (this.certificates == "0")
			return ""
		var id = this.hostB64 + "_" + this.infoHash
		var linkText = _t("View {0} Certificates", this.certificates)
		var link = "<a href='#' onclick='window.showCertificates(\"" + this.hostB64 + "\",\"" + this.infoHash + "\");return false;'>" + linkText + "</a>"
		var linkBlock = "<div id='certificates-link-" + id + "'>" + link + "</div>"
		linkBlock += "<div id='certificates-" + id + "'></div>"
		return linkBlock
	}
}

class Browse {
	constructor(host, hostB64, status, totalResults, receivedResults, revision) {
		this.host = host
		this.hostB64 = hostB64
		this.totalResults = totalResults
		this.receivedResults = receivedResults
		this.status = status
		this.revision = revision
		this.key = null
		this.descending = null
	}
	
	setSort(key, descending) {
		this.key = key
		this.descending = descending
	}
	
	getBrowseLink() {
		return "<a href='#' onclick='window.showResults(\"" + this.host + "\",\"" + this.key + "\",\"" + this.descending + 
			"\");return false;'>" + this.host + "</a>"		
	}
}

function initBrowse() {
	setTimeout(refreshActive, 1)
	setInterval(refreshActive, 3000)
}

var currentHost = null
var browsesByHost = new Map()
var resultsByInfoHash = new Map()

function showCertificates(hostB64, infoHash) {
	var fetch = new CertificateFetch(hostB64, infoHash)
	certificateFetches.set(fetch.divId, fetch)
	
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var hideLinkText = _t("Hide Certificates")
			var hideLink = "<a href='#' onclick='window.hideCertificates(\"" + hostB64 + "\",\"" + infoHash + "\"); return false;'>" + hideLinkText + "</a>"
			var hideLinkSpan = document.getElementById("certificates-link-" + fetch.divId)
			hideLinkSpan.innerHTML = hideLink
			
			var certSpan = document.getElementById("certificates-" + fetch.divId)
			certSpan.innerHTML = _t("Fetching Certificates")
		}
	}
	xmlhttp.open("POST", "/MuWire/Certificate", true)	
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send("action=fetch&user=" + hostB64 + "&infoHash=" + infoHash)
}

function hideCertificates(hostB64, infoHash) {
	var id = hostB64 + "_" + infoHash
	certificateFetches.delete(id)
	
	var certSpan = document.getElementById("certificates-" + id)
	certSpan.innerHTML = ""
	
	var result = resultsByInfoHash.get(infoHash)
	var showLinkText = _t("View {0} Certificates", result.certificates)
	var showLink = "<a href='#' onclick='window.showCertificates(\"" + hostB64 + "\",\"" + infoHash + "\");return false;'>" + showLinkText + "</a>"
	
	var linkSpan = document.getElementById("certificates-link-" + id)
	linkSpan.innerHTML = showLink
}

function refreshActive() {
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			
			var currentBrowse = null
			if (currentHost != null)
				currentBrowse = browsesByHost.get(currentHost)
			
			var xmlDoc = this.responseXML
			var browses = xmlDoc.getElementsByTagName("Browse")
			var i
			for (i = 0;i < browses.length; i++) {
				var host = browses[i].getElementsByTagName("Host")[0].childNodes[0].nodeValue;
				var hostB64 = browses[i].getElementsByTagName("HostB64")[0].childNodes[0].nodeValue;
				var status = browses[i].getElementsByTagName("BrowseStatus")[0].childNodes[0].nodeValue;
				var totalResults = browses[i].getElementsByTagName("TotalResults")[0].childNodes[0].nodeValue;
				var count = browses[i].getElementsByTagName("ResultsCount")[0].childNodes[0].nodeValue;
				var revision = browses[i].getElementsByTagName("Revision")[0].childNodes[0].nodeValue;
				
				var browse = new Browse(host, hostB64, status, totalResults, count, revision)
				browsesByHost.set(host, browse)
			}
			
			var tableHtml = "<table><thead><tr><th>" + _t("Host") + "</th><th>" + _t("Status") + "</th><th>" + _t("Results") + "</th></tr></thead></tbody>";
			for (var [host, browse] of browsesByHost) {
				var browseLink = browse.getBrowseLink()
				
				tableHtml += "<tr>"
				tableHtml += "<td>" + browseLink + "</td>"
				tableHtml += "<td>" + browse.status + "</td>"
				
				var percent = browse.receivedResults + "/" + browse.totalResults
				tableHtml += "<td>"+percent+"</td>"
				
				tableHtml += "</tr>"
			}
			tableHtml += "</tbody></table>"
			
			var tableDiv = document.getElementById("activeBrowses")
			tableDiv.innerHTML = tableHtml
			
			if (currentBrowse != null) {
				var newBrowse = browsesByHost.get(currentHost)
				if (currentBrowse.revision < newBrowse.revision)
					showResults(currentHost, currentBrowse.key, currentBrowse.descending)
			}
		}
	}
	xmlhttp.open("GET", "/MuWire/Browse?section=status", true)
	xmlhttp.send()
}

function showResults(host, key, descending) {
	
	var browse = browsesByHost.get(host)
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			currentHost = host
			var xmlDoc = this.responseXML
			
			resultsByInfoHash.clear()
			
			var results = xmlDoc.getElementsByTagName("Result")
			var i
			for (i = 0; i < results.length; i++) {
				var name = results[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue
				var size = results[i].getElementsByTagName("Size")[0].childNodes[0].nodeValue
				var downloading = results[i].getElementsByTagName("Downloading")[0].childNodes[0].nodeValue
				var infoHash = results[i].getElementsByTagName("InfoHash")[0].childNodes[0].nodeValue
				var comment = results[i].getElementsByTagName("Comment")
				if (comment != null && comment.length == 1)
					comment = comment[0].childNodes[0].nodeValue
				else
					comment = null
				var certificates = results[i].getElementsByTagName("Certificates")[0].childNodes[0].nodeValue
					
				var result = new Result(name, size, comment, infoHash, downloading, certificates, browse.hostB64)
				resultsByInfoHash.set(infoHash, result)
			}
			
			if (descending == "descending")
				descending = "ascending"
			else
				descending = "ascending"
			
			var table = new Table(["Name", "Size", "Download"], "sort", key, descending)
			
			for (var [infoHash, result] of resultsByInfoHash) {
				
				var showComments = ""
				if (result.comment != null) {
					showComments = "<br/><span id='show-comment-" + infoHash +"'>" + getShowCommentLink(infoHash) + "</span>"
					showComments += "<div id='comment-" + infoHash + "'></div>"
				}
				
				var nameCell = result.name + showComments + result.getCertificateBlock()
				var sizeCell = result.size
				var downloadCell = null
				
				if (result.downloading == "true")
					downloadCell = _t("Downloading")
				else
					downloadCell = getDownloadLink(host, infoHash)
					
				var mapping = new Map()
				mapping.set("Name", nameCell)
				mapping.set("Size", sizeCell)
				mapping.set("Download", downloadCell)
				
				table.addRow(mapping)
			}
			
			var tableDiv = document.getElementById("resultsTable")
			tableDiv.innerHTML = table.render()
		}
	}
	var paramString = "/MuWire/Browse?section=results&host=" + browse.hostB64
	if (key != null) 
		paramString += "&key=" + key + "&order=" + descending
	
	xmlhttp.open("GET", paramString, true)
	xmlhttp.send()
}

function sort(key, descending) {
	var currentBrowse = browsesByHost.get(currentHost)
	currentBrowse.setSort(key, descending)
	showResults(currentHost, key, descending)
}

function getDownloadLink(host, infoHash) {
	return "<a href='#' onclick='window.download(\"" + host + "\",\"" + infoHash + "\");return false;'>" + _t("Download") + "</a>"
}

function download(host,infoHash) {
	var currentBrowse = browsesByHost.get(host)
	var result = resultsByInfoHash.get(infoHash)
	var hostB64 = currentBrowse.hostB64
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			showResults(host, currentBrowse.key, currentBrowse.descending)
		}
	}	
	xmlhttp.open("POST", "/MuWire/Browse", true)
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send("action=download&infoHash="+infoHash+"&host="+hostB64)
}

function getShowCommentLink(infoHash) {
	return "<a href='#' onclick='window.showComment(\"" + infoHash + "\"); return false;'>" + _t("Show Comment") + "</a>"
}

function showComment(infoHash) {
	var linkSpan = document.getElementById("show-comment-"+infoHash)
	var hideComment = "<a href='#' onclick='window.hideComment(\"" + infoHash + "\"); return false;'>" + _t("Hide Comment") + "</a>"
	linkSpan.innerHTML = hideComment
	
	var commentSpan = document.getElementById("comment-"+infoHash)
	var comment = resultsByInfoHash.get(infoHash).comment
	commentSpan.innerHTML = "<pre>" + comment + "</pre>"
}

function hideComment(infoHash) {
	var linkSpan = document.getElementById("show-comment-"+infoHash)
	linkSpan.innerHTML = getShowCommentLink(infoHash)
	
	var commentSpan = document.getElementById("comment-"+infoHash)
	commentSpan.innerHTML = ""
}
