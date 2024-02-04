export default {
	async scheduled(event, env, ctx) {
		const config = JSON.parse(await env.STATUS_INFO.get('CONFIG'));
		let data = { monitors: {}, notice: config['notice'] };
		//console.log(config);
		for (let i of config['monitors']) {
			console.log(i);
			if (i['type'] == 'website' || i['type'] == 'keyword') {
				await fetch(i['url'], { method: i['method'] })
					.then((response) => {
						data['monitors'][i['name']]={'time': new Date().getTime(), 'status': false}
						if (response.status == 200) {
							if(i['type'] != 'keyword'){
								data['monitors'][i['name']]['status'] = true;
							} else if(response.text().includes(i['keyword'])){
								data['monitors'][i['name']]['status'] = true;
							}
						}
					})
					.catch(() => {
						data['monitors'][i['name']]={'time': new Date().getTime(), 'status': false}
					})
			}
		}

		await env.STATUS_INFO.put('DATA', JSON.stringify(data));
	},
};
