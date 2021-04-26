const BASE='.ranker.com/?keywords='
const SCRIPT_ID="https://script.google.com/macros/s/AKfycbwsRhwBMeq7AVwJRiuIM616-WvrZkBYKwgHHz4sLPRGKt9EPdq0DqJv5paJuN7QsoAxEg/exec"
let subdomain="results."
let result=[]
let keyword="";
let id=0;
let urls=[];
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
	sendResponse("From background")
	if(id){
		if(message.type==="links"){
			//console.log("Got links",message.links)
			const timestamp=getTimeNow();
			const date=(new Date()).toDateString()
			result.push({keyword,date,timestamp,res:message.links})
			if(urls.length){
				keyword=urls.shift()
				const url="https://"+subdomain+BASE+keyword
				chrome.tabs.update(id,{url},(tab)=>{})
			}else{
					downloadResult()
			}
			
		}else if(message.type==="stop"){
			stopped=true
			downloadResult()
		}
		}
	
	if(message.type==="start"){
		({keyword,urls,id,subdomain}=message.data)
	}
	
})


function getTimeNow(delemiter=":"){
	const now=new Date()
	const timestamp=now.getUTCHours()+delemiter+now.getUTCMinutes()+delemiter+now.getUTCSeconds();
	return timestamp;
}


function downloadResult(){
	const body=result.map(item=>[item.keyword,item.date,item.timestamp,...item.res])
	
	result=result.map(item=>([JSON.stringify(item.keyword),item.date,item.timestamp,...item.res]).join(","))
	result.splice(0,0,"keyword,date,time, url1,url2,url3,url4,url5,url6")
	result=result.join("\n")	
	fetch(SCRIPT_ID,{method:"POST",headers:{"content-type":"Application/json"},body:JSON.stringify(body)})
	.catch(()=>console.log("Error during sending email"))
	blob=new Blob([result],{type:"text/csv"});
	dataUrl=URL.createObjectURL(blob)
	result=[]
	keyword=""
	id=0
	chrome.downloads.download({url:dataUrl,filename:"'file.csv"},()=>console.log("Downloaded"))
	
}

chrome.commands.onCommand.addListener((command)=>{
	if(id){
		chrome.tabs.discard(id,()=>{
			downloadResult()
		})
	}
})

chrome.tabs.onRemoved.addListener((tabId,removed)=>{
	if(id===tabId){
		id=0
	}
})