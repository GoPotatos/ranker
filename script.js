const BASE='http://results.ranker.com/?keywords='
urls=[]
let result=[]
let keyword="";
let id=null;
window.onload=()=>{
	const form=document.forms[0]
	const file=document.querySelector("#file")
	file.onchange=function(e){
		form.onsubmit(e)
	}
	form.onsubmit=function(e){
		
		e.preventDefault()
		chrome.storage.local.remove(["urls","keyword","id"])
		let text=""
		if(file.files.length){
			reader=new FileReader()
			reader.onload=(e)=>{
			console.log("Loaded")
			urls=reader.result.split("\n")
			text=urls.pop()
			keyword=text
			chrome.storage.local.set({keyword})
			chrome.storage.local.set({urls})
			chrome.tabs.update({url:BASE+text},(tab)=>{
			id=tab.id
			chrome.storage.local.set({id},()=>{
				window.close()
			})
			
		})
			}
			reader.readAsText(file.files[0])
			
			
		}else{
			text=document.querySelector("#search-box").value
			keyword=text
			chrome.storage.local.set({keyword})
			//chrome.storage.local.remove("urls")
				
		console.log("Text is",text,file.files.length)
		setTimeout(function(){
		chrome.tabs.update({url:BASE+text},(tab)=>{
			id=tab.id
			chrome.storage.local.set({id},()=>{
				window.close()
			})
			
		})
		},5000)
			
		}
		//window.close()
		
		
			
				
	}
}



/*
chrome.tabs.onUpdated.addListener((tabId,info,tab)=>{
	if(tabId==id){
		console.log("Found tab",id,tabId,info.status)
		if(info.status==="complete")
		
		chrome.tabs.sendMessage(tabId,chrome.runtime.id,res=>{
			console.log("Res",res)
			result.push({keyword,res})
			if(urls.length){
				const text=urls.pop()
			chrome.tabs.update({url:BASE+text},(tab)=>{
			}
			)
			}
			})
		
			
			
	}
})*/