export default {
	async scheduled(event, env, ctx) {
		const config = JSON.parse(await env.STATUS_INFO.get('CONFIG'));
		let data = { monitors: {}, notice: config['notice'] };
		for (let i of config['monitors']) {
			if (i['type'] == 'website' || i['type'] == 'keyword') {
				await fetch(i['url'], { method: i['method'] })
					.then(async (response) => {
						data['monitors'][i['name']] = { time: new Date().getTime(), status: false };
						if (response.status == 200 || response.status == 400 || response.status == 401 || response.status == 403) {
							if (i['type'] != 'keyword') {
								data['monitors'][i['name']]['status'] = true;
							} else {
								if ((await response.text()).includes(i['keyword'])) {
									data['monitors'][i['name']]['status'] = true;
								}
							}
						}
					})
					.catch(() => {
						data['monitors'][i['name']] = { time: new Date().getTime(), status: false };
					});
			}
		}

		await env.STATUS_INFO.put('DATA', JSON.stringify(data));
	},
};
