import { error } from '@sveltejs/kit';
import { cattleCatalog } from '$lib/data/cattle.js';

export const prerender = true;

export function entries() {
	return cattleCatalog.map((item) => ({ slug: item.slug }));
}

export function load({ params }) {
	const lot = cattleCatalog.find((item) => item.slug === params.slug);
	if (!lot) throw error(404, 'Livestock Lot Not Found');
	return { lot };
}
