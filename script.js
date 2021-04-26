const BASE='.ranker.com/?keywords='
urls=[]
let result=[]
let keyword="";
let id=null;
let subdomain="results";
window.onload=()=>{
	const form=document.forms[0]
	const file=document.querySelector("#file")
	const subdomainBox=document.querySelector("#subdomain-box")
	subdomainBox.onchange=function(e){
		subdomain=e.target.value;
	}
	
	file.onchange=function(e){
		form.onsubmit(e)
	}
	form.onsubmit=function(e){
		
		e.preventDefault()
		if(file.files.length){
			reader=new FileReader()
			reader.onload=(e)=>{
			urls=reader.result.split(/\r?\n\r?/)
			urls.shift()
			const keyword=urls.shift()
			//keyword=text
			updateTab(urls,keyword)
			
			}
			reader.readAsText(file.files[0])
			
			
		}else{
			const keyword=document.querySelector("#search-box").value
			const urls=[]
			updateTab(urls,keyword)
		
		
		
			
		}

	}
}

function updateTab(urls,keyword){
	const url="https://"+subdomain+BASE+keyword;
	chrome.tabs.update({url},(tab)=>{
		const id=tab.id
		const data={keyword,urls,id,subdomain}	
		chrome.runtime.sendMessage({type:"start",data})
		window.close()
	})
}