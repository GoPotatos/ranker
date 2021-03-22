let counter=0
window.onload=()=>{
	timer=setInterval(function(){
		links=Array.from(document.querySelectorAll("[data-ads] .text-sm")).map(item=>item.innerText)
		counter++;
		if(links.length||counter>=20){
			clearInterval(timer)
			chrome.runtime.sendMessage(chrome.runtime.id,{type:"links",links},res=>console.log("res",res))
		}
		//console.log("onload",new Date(),links,chrome.runtime.id)
	},1000)

}
