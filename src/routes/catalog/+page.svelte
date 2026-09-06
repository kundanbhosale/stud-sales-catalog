<script>
	import { cattleCatalog } from '$lib/data/cattle.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';

	// State management for advanced filters
	let searchQuery = $state('');
	let selectedBreed = $state('All');
	let selectedStatus = $state('All');
	let selectedCategory = $state('All'); // 'All', 'Bull', 'Heifer', 'Cow'
	let maxPrice = $state(10000);
	let minWeight = $state(0);
	let polledOnly = $state(false);
	let genomicOnly = $state(false);

	let breeds = ['All', ...new Set(cattleCatalog.map((i) => i.breed))];
	let categories = ['All', 'Bull', 'Heifer', 'Cow'];

	// Filter count tracker
	let activeFilterCount = $derived(
		(selectedBreed !== 'All' ? 1 : 0) +
			(selectedStatus !== 'All' ? 1 : 0) +
			(selectedCategory !== 'All' ? 1 : 0) +
			(maxPrice < 10000 ? 1 : 0) +
			(minWeight > 0 ? 1 : 0) +
			(polledOnly ? 1 : 0) +
			(genomicOnly ? 1 : 0)
	);

	function resetFilters() {
		searchQuery = '';
		selectedBreed = 'All';
		selectedStatus = 'All';
		selectedCategory = 'All';
		maxPrice = 10000;
		minWeight = 0;
		polledOnly = false;
		genomicOnly = false;
	}

	let filteredCattle = $derived(
		cattleCatalog.filter((item) => {
			const matchesSearch =
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.breed.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesBreed = selectedBreed === 'All' || item.breed === selectedBreed;
			const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
			const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

			// Extract numeric price and weight safely
			const itemPrice = item.price;
			const matchesPrice = itemPrice <= maxPrice;

			const weightMatch = item.weight.match(/([\d,]+)\s*lbs/);
			const itemWeight = weightMatch ? parseInt(weightMatch[1].replace(/,/g, ''), 10) : 0;
			const matchesWeight = itemWeight >= minWeight;

			const matchesPolled =
				!polledOnly || item.polledStatus?.toLowerCase().includes('homozygous polled');
			const matchesGenomic = !genomicOnly || item.dnaProfile?.toLowerCase().includes('genomic');

			return (
				matchesSearch &&
				matchesBreed &&
				matchesStatus &&
				matchesCategory &&
				matchesPrice &&
				matchesWeight &&
				matchesPolled &&
				matchesGenomic
			);
		})
	);
</script>

<div class="container mx-auto space-y-6 px-4 py-10">
	<div class="flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end">
		<div>
			<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Sales Catalog & Archives</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Advanced filtration for genetics, EPD thresholds, pricing, and live inventory.
			</p>
		</div>
		<div class="flex items-center gap-2">
			{#if activeFilterCount > 0}
				<Badge variant="secondary" class="px-2.5 py-1 text-xs">
					{activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
				</Badge>
				<Button
					variant="ghost"
					size="sm"
					onclick={resetFilters}
					class="text-xs text-red-600 hover:text-red-700"
				>
					Reset All
				</Button>
			{/if}
			<Badge variant="outline" class="font-mono text-xs">{filteredCattle.length} Lots Found</Badge>
		</div>
	</div>

	<div class="flex flex-wrap items-center gap-2">
		<span class="mr-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>Category:</span
		>
		{#each categories as cat}
			<button
				type="button"
				onclick={() => (selectedCategory = cat)}
				class={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
					selectedCategory === cat
						? 'bg-primary text-primary-foreground shadow-xs'
						: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
				}`}
			>
				{cat === 'All' ? 'All Classes' : `${cat}s`}
			</button>
		{/each}
	</div>

	<div
		class="grid grid-cols-1 gap-4 rounded-xl border bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-4"
	>
		<div class="space-y-1.5">
			<label
				for="search-input"
				class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
				>Search Lot</label
			>
			<Input
				id="search-input"
				placeholder="Tag #, Reg #, Name..."
				bind:value={searchQuery}
				class="bg-white"
			/>
		</div>

		<div class="space-y-1.5">
			<label
				for="breed-select"
				class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
				>Breed Selection</label
			>
			<select
				id="breed-select"
				bind:value={selectedBreed}
				class="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-xs shadow-2xs"
			>
				{#each breeds as breed}
					<option value={breed}>{breed === 'All' ? 'All Breeds' : breed}</option>
				{/each}
			</select>
		</div>

		<div class="space-y-1.5">
			<label
				for="status-select"
				class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
				>Inventory Status</label
			>
			<select
				id="status-select"
				bind:value={selectedStatus}
				class="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-xs shadow-2xs"
			>
				<option value="All">All Statuses (Available & Sold)</option>
				<option value="Available">Available Only</option>
				<option value="Sold">Sold Archive</option>
			</select>
		</div>

		<div class="space-y-1.5">
			<div
				class="flex justify-between text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
			>
				<label for="max-price">Max Price</label>
				<span class="font-mono text-primary">${maxPrice.toLocaleString()}</span>
			</div>
			<input
				id="max-price"
				type="range"
				min="3000"
				max="10000"
				step="500"
				bind:value={maxPrice}
				class="h-2 w-full cursor-pointer rounded-lg bg-slate-200 accent-primary"
			/>
		</div>
	</div>

	<div class="flex flex-wrap items-center gap-4 pt-1 text-xs font-medium text-slate-700">
		<label
			class="flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-1.5 shadow-2xs"
		>
			<input
				type="checkbox"
				bind:checked={polledOnly}
				class="rounded text-primary focus:ring-primary"
			/>
			<span>Homozygous Polled Only</span>
		</label>
		<label
			class="flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-1.5 shadow-2xs"
		>
			<input
				type="checkbox"
				bind:checked={genomicOnly}
				class="rounded text-primary focus:ring-primary"
			/>
			<span>Genomic Enhanced (i50K/DNA Verified)</span>
		</label>
		<div class="ml-auto flex items-center gap-2">
			<span class="text-[11px] text-muted-foreground">Min Weight:</span>
			<select bind:value={minWeight} class="rounded border bg-white px-2 py-1 text-xs">
				<option value={0}>Any Weight</option>
				<option value={700}>700+ lbs</option>
				<option value={1000}>1,000+ lbs</option>
				<option value={1300}>1,300+ lbs</option>
			</select>
		</div>
	</div>

	{#if filteredCattle.length === 0}
		<div
			class="flex flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50/50 p-12 text-center"
		>
			<p class="text-base font-bold text-slate-800">No matching livestock lots found</p>
			<p class="mt-1 text-xs text-muted-foreground">
				Try broadening your search query, increasing max price, or resetting active filters.
			</p>
			<Button variant="outline" size="sm" class="mt-4 text-xs" onclick={resetFilters}
				>Clear All Filters</Button
			>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredCattle as item (item.id)}
				<a href="/catalog/{item.slug}" class="group block">
					<Card
						class="flex h-full flex-col justify-between overflow-hidden py-0 shadow-sm transition-all duration-200 hover:border-slate-400 hover:shadow-md"
					>
						<div>
							<div class="relative aspect-video overflow-hidden bg-slate-900 sm:aspect-square">
								{#if item.status === 'Sold'}
									<div
										class="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-red-500/60 text-5xl font-black text-background"
									>
										<span class="-rotate-12 border-8 border-background p-4">
											<span>SOLD</span>
										</span>
									</div>
								{/if}
								<img
									src={item.images[0]}
									alt={item.title}
									loading="lazy"
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<Badge
									class="absolute top-3 right-3 shadow-xs {item.status === 'Available'
										? 'bg-emerald-600'
										: item.status === 'Sold'
											? 'bg-slate-800'
											: 'bg-amber-600'}"
								>
									{item.status}
								</Badge>
								<Badge
									variant="secondary"
									class="absolute top-3 left-3 bg-white/95 font-mono text-[10px] text-slate-900 shadow-xs"
								>
									Tag #{item.tagNumber}
								</Badge>
							</div>

							<CardHeader class="p-4 pb-2">
								<CardTitle class="text-lg font-bold transition-colors group-hover:text-primary"
									>{item.title}</CardTitle
								>
								<p class="text-xs font-medium text-muted-foreground">{item.breed} • {item.type}</p>
							</CardHeader>

							<CardContent class="space-y-3 p-4 pt-0 text-xs text-slate-600">
								<p class="line-clamp-2 leading-relaxed">{item.description}</p>
								<div
									class="grid grid-cols-2 gap-2 rounded-lg border bg-slate-50/80 p-2 font-mono text-[11px]"
								>
									<div>
										<span class="font-sans font-normal text-slate-400">BW:</span>
										{item.epv.birthWeight}
									</div>
									<div>
										<span class="font-sans font-normal text-slate-400">WW:</span>
										{item.epv.weaningWeight}
									</div>
								</div>
							</CardContent>
						</div>

						<CardFooter
							class="mt-auto flex items-center justify-between border-t bg-slate-50/50 p-4"
						>
							<span class="font-serif text-xl font-extrabold text-primary"
								>${item.price.toLocaleString()}</span
							>
							<span
								class="inline-flex items-center text-xs font-semibold text-primary group-hover:underline"
							>
								Inspect Lot &rarr;
							</span>
						</CardFooter>
					</Card>
				</a>
			{/each}
		</div>
	{/if}
</div>
