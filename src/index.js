export default {
	async scheduled(event, env, ctx) {
		const config = JSON.parse(await env.STATUS_INFO.get('CONFIG'));
		let data = { monitors: {}, date: new Date().getTime(), notice: config['notice'] };
		//console.log(config);
		for (let i of config['monitors']) {
			console.log(i);
			if (i['type'] == 'website') {
				await fetch(i['url'], { method: i['method'] })
					.then((response) => {
						if (response.status == 200) {
							//console.log("Website is up!1");
							data['monitors'][i['name']] = true;
						} else {
							//console.log("Website is down!2");
							data['monitors'][i['name']] = false;
						}
					})
					.catch(() => {
						//console.log("Website is down!3");
						data['monitors'][i['name']] = false;
					});
			}
		}
		//console.log(data);
		await env.STATUS_INFO.put('DATA', JSON.stringify(data));
	},
};
