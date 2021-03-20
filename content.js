
			
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
	console.log("Got message",message)
	links=Array.from(document.querySelectorAll("[data-ads] .text-sm")).map(item=>item.innerText)
	//setTimeout(function(){
	console.log("Responding",new Date(),links)
	window.sendResponse=sendResponse
	sendResponse(links)
//	},1000)
	return true
	
	//window.response=sendResponse
})
counter=0
window.onload=()=>{
	timer=setInterval(function(){
	links=Array.from(document.querySelectorAll("[data-ads] .text-sm")).map(item=>item.innerText)
	//notFound=document.querySelector(".edition-fourstep");
	counter++;
	if(links.length||counter>=20){
		clearInterval(timer)
		chrome.runtime.sendMessage(chrome.runtime.id,{type:"links",links},res=>console.log("res",res))
	}
	console.log("onload",new Date(),links,chrome.runtime.id)
	},1000)
	//if(window.sendResponse)window.sendResponse(links)
}