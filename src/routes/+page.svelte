<script>
	import { cattleCatalog } from '$lib/data/cattle.js';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-slate-900 py-24 text-white">
	<div class="absolute inset-0 opacity-30">
		<img
			src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1800&q=80"
			alt="Pasture Hero"
			class="h-full w-full object-cover"
		/>
	</div>
	<div class="relative container mx-auto px-4 text-center">
		<Badge class="mb-4 bg-amber-500 font-bold text-slate-950">2026 Private Treaty Sales Open</Badge>
		<h1 class="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl">
			Genetically Superior Cattle.<br />Proven In Field Conditions.
		</h1>
		<p class="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
			Premier Black Angus, Brahman, and Simmental bulls and females engineered for calving ease,
			structural longevity, and maximum carcass yield.
		</p>
		<div class="flex justify-center gap-4">
			<Button href="/catalog" size="lg">Browse Sales Catalog</Button>
			<Button href="/contact" variant="outline" size="lg">Book Ranch Tour</Button>
		</div>
	</div>
</section>

<!-- Active vs Sold Count Highlights -->
<section class="border-b bg-slate-100 py-12">
	<div class="container mx-auto grid grid-cols-2 gap-6 px-4 text-center md:grid-cols-4">
		<div>
			<p class="text-3xl font-extrabold text-primary">35+</p>
			<p class="mt-1 text-xs text-muted-foreground">Years Breeding Heritage</p>
		</div>
		<div>
			<p class="text-3xl font-extrabold text-primary">100%</p>
			<p class="mt-1 text-xs text-muted-foreground">DNA & Genomic Verified</p>
		</div>
		<div>
			<p class="text-3xl font-extrabold text-primary">Top 2%</p>
			<p class="mt-1 text-xs text-muted-foreground">CED & Growth EPD Rank</p>
		</div>
		<div>
			<p class="text-3xl font-extrabold text-primary">Nationwide</p>
			<p class="mt-1 text-xs text-muted-foreground">Transport & Insurance Available</p>
		</div>
	</div>
</section>

<!-- Featured Cattle Grid -->
<section class="py-16">
	<div class="container mx-auto px-4">
		<div class="mb-10 flex items-end justify-between">
			<div>
				<h2 class="text-3xl font-bold">Featured Stud Lots</h2>
				<p class="text-sm text-muted-foreground">
					Select lots currently open for private treaty or archival inspection.
				</p>
			</div>
			<Button href="/catalog" variant="ghost">View Catalog &rarr;</Button>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each cattleCatalog as item}
				<a href="/catalog/{item.slug}">
					<Card
						class="flex flex-col justify-between overflow-hidden py-0 shadow-md transition-shadow hover:shadow-lg"
					>
						<div>
							<div class="relative aspect-square">
								{#if item.status === 'Sold'}
									<div
										class="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-red-500/60 text-5xl font-black text-background"
									>
										<span class="-rotate-12 border-8 border-background p-4">
											<span>SOLD</span>
										</span>
									</div>
								{/if}
								<img src={item.images[0]} alt={item.title} class="h-full w-full object-cover" />
								<Badge
									class="absolute top-3 right-3 {item.status === 'Available'
										? 'bg-emerald-600'
										: item.status === 'Sold'
											? 'bg-slate-800'
											: 'bg-amber-600'}"
								>
									{item.status}
								</Badge>
								<Badge variant="secondary" class="absolute top-3 left-3 bg-white/90 text-slate-900">
									Tag #{item.tagNumber}
								</Badge>
							</div>
							<CardHeader class="p-5 pb-2">
								<CardTitle class="text-xl font-bold">{item.title}</CardTitle>
								<p class="text-xs text-muted-foreground">{item.breed} • {item.type}</p>
							</CardHeader>
							<CardContent class="space-y-3 p-5 pt-0 text-xs text-slate-600">
								<p class="line-clamp-2">{item.description}</p>
								<div class="grid grid-cols-2 gap-2 rounded border bg-slate-50 p-2">
									<div><strong>BW:</strong> {item.epv.birthWeight}</div>
									<div><strong>WW:</strong> {item.epv.weaningWeight}</div>
								</div>
							</CardContent>
						</div>

						<CardFooter class="mt-4 flex items-center justify-between border-t p-5 pt-0">
							<span class="text-xl font-extrabold text-primary">${item.price.toLocaleString()}</span
							>
							<Button href="/catalog/{item.slug}" size="lg">Inspect Pedigree</Button>
						</CardFooter>
					</Card>
				</a>
			{/each}
		</div>
	</div>
</section>
