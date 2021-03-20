const BASE='http://results.ranker.com/?keywords='
let result=[]
result2=[]
let keyword="";
let tabId=null;
let id=0;
chrome.storage.local.get("id",key=>{
	id=key.id||0
})
chrome.storage.local.get("urls",key=>{
	urls=key.urls||[]
})
chrome.storage.local.get("keyword",key=>{
	keyword=key.keyword
	console.log("keyword",keyword)
})

 chrome.tabs.onUpdated.addListener((tabId,info,tab)=>{
	if(id&&tabId==id){
		console.log("Found tab",id,tabId,info.status)
		if(info.status==="complete"){
		
		chrome.tabs.sendMessage(tabId,chrome.runtime.id,res=>{
			console.log("Res",res)
			result.push({keyword,res})
			result2=result
			if(urls.length){
				const text=urls.pop()
				keyword=text
			chrome.tabs.update(id,{url:BASE+text},(tab)=>{
			}
			)
			}else{
				
				result=result.map(item=>([JSON.stringify(item.keyword),...item.res]).join(","))
				result.splice(0,0,"keyword, url1,url2,url3,url4,url5,url6")
				result=result.join("\n")
				blob=new Blob([result],{type:"text/csv"});
				dataUrl=URL.createObjectURL(blob)
				result=[]
				keyword=""
				chrome.storage.local.remove(["keyword","urls","id"])
				chrome.downloads.download({url:dataUrl,filename:"'file.csv"},()=>console.log("Downloaded"))

				
			}
			})
		
			
	}
	}
})

chrome.storage.onChanged.addListener((changes)=>{
	for(key in changes){
		if(key==="id"){
			console.log("id updated",changes[id])
			id=changes[key].newValue||0
		}else if(key==="keyword"){
			keyword=changes[key].newValue||""
		}else if(key==="urls"){
			urls=changes[key].newValue||[]
		}
	}
})