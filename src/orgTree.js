import $model from '@root/api'
function packageTree(pid,list){
	let node = list.filter(i=>i.pid==pid);
	let arr = node.map(i=>{
		return {
			label: i.name,
			key: i.id,
			value: i.id,
			pid:pid,
			children: packageTree(i.id,list)
		}
	})
	return arr
}
export default {
	data:function(){
		return new Promise(function(resolve,reject){
				$model.getOrg().then(i=>{
					resolve(packageTree(-1,i.data)) 
				})
    })
		
	}
}