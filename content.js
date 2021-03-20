
			
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
	console.log("Got message",message)
	links=Array.from(document.querySelectorAll("[data-ads] .text-sm")).map(item=>item.innerText)
	sendResponse(links)
	//window.response=sendResponse
})