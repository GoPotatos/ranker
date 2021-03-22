const BASE='http://results.ranker.com/?keywords='
let result=[]
let keyword="";
let id=0;
let urls=[];

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
	sendResponse("From background")
	if(id){
		if(message.type==="links"){
			//console.log("Got links",message.links)
			result.push({keyword,res:message.links})
			if(urls.length){
				keyword=urls.shift()
				chrome.tabs.update(id,{url:BASE+keyword},(tab)=>{})
			}else{
					downloadResult()
			}
			
		}else if(message.type==="stop"){
			stopped=true
			downloadResult()
		}
		}
	
	if(message.type==="start"){
		({keyword,urls,id}=message.data)
	}
})



function downloadResult(){
	result=result.map(item=>([JSON.stringify(item.keyword),...item.res]).join(","))
	result.splice(0,0,"keyword, url1,url2,url3,url4,url5,url6")
	result=result.join("\n")
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