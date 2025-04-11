import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { is_homepage } from '@utils/is-homepage';

const available_packages = ['svelte', 'vanilla'];

export const onRequest = defineRouteMiddleware((context) => {
	const { sidebar, id } = context.locals.starlightRoute;
	context.locals.available_packages = available_packages;
	const current_package = available_packages.find((pkg) => id.startsWith(pkg)) ?? 'svelte';
	function update_sidebar(sidebar_part: typeof sidebar) {
		for (let element of sidebar_part) {
			if (element.type === 'group') {
				update_sidebar(element.entries);
				continue;
			}
			element.href = `/${current_package}${element.href}`;
		}
	}
	context.locals.starlightRoute.siteTitle = is_homepage(id)
		? '@sheepdog'
		: `@sheepdog/${current_package}`;

	update_sidebar(sidebar);
});
