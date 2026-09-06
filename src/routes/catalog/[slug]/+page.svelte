<script>
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Carousel from '$lib/components/ui/carousel';
	import Input from '$lib/components/ui/input/input.svelte';
	import siteConfig from '$lib/data/site-config.js';

	let { data } = $props();
	let lot = $derived(data.lot);

	// Carousel state
	let carouselApi = $state(null);
	let activeMediaIndex = $state(0);

	$effect(() => {
		if (!carouselApi) return;
		carouselApi.on('select', () => {
			activeMediaIndex = carouselApi.selectedScrollSnap();
		});
	});

	function scrollTo(index) {
		if (carouselApi) carouselApi.scrollTo(index);
	}

	// Media Array
	let mediaItems = $derived([
		...(lot.images || []).map((url) => ({ type: 'image', src: url })),
		...(lot.videoUrl ? [{ type: 'video', src: lot.videoUrl }] : [])
	]);

	let currentMedia = $derived(mediaItems[activeMediaIndex] || { type: 'image', src: '' });

	let openFaq = $state(null);

	function toggleFaq(index) {
		openFaq = openFaq === index ? null : index;
	}

	let qrCodeUrl = $derived(
		`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
			`${siteConfig.url}/catalog/${lot.slug}`
		)}`
	);

	// Growth Chart Points
	let growthPoints = $derived(() => {
		if (!lot.growthWeightChart?.length) return '';
		const maxWeight = Math.max(...lot.growthWeightChart.map((d) => d.weight)) * 1.1;
		const width = 500;
		const height = 180;
		return lot.growthWeightChart
			.map((pt, idx) => {
				const x = (idx / (lot.growthWeightChart.length - 1)) * (width - 40) + 20;
				const y = height - (pt.weight / maxWeight) * (height - 30) - 15;
				return `${x},${y}`;
			})
			.join(' ');
	});

	const buyerFaqs = [
		{
			q: 'Is this lot recommended for first-calf heifers or mature cows?',
			a: 'Check Calving Ease Direct (CED) and Birth Weight (BW). Higher CED (>+8) and lower BW values mean reduced calving stress, making the sire ideal for young heifers.'
		},
		{
			q: 'What health clearances are guaranteed before pickup?',
			a: 'All animals pass a complete Breeding Soundness Exam (BSE), carry negative BVD-PI test results, and receive 7-way clostridial plus respiratory vaccinations.'
		},
		{
			q: 'How are official association pedigrees transferred?',
			a: 'Official pedigree registration papers are transferred directly to your breed association membership ID upon receipt of final payment.'
		}
	];

	let copied = $state(false);

	async function copyToClipboard() {
		await navigator.clipboard.writeText(`${siteConfig.url}/catalog/${lot.slug}`);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}

	// Dialog & Form States
	let showInquiryModal = $state(false);
	let showVisitModal = $state(false);
	let inquiryType = $state('Reserve Price / Purchase');
	let transportOption = $state('Ranch Pickup');
	let isSubmitting = $state(false);
	let inquirySubmitted = $state(false);
	let visitSubmitted = $state(false);

	let inquiryForm = $state({
		name: '',
		phone: '',
		email: '',
		message: ''
	});

	let visitForm = $state({
		name: '',
		phone: '',
		email: '',
		date: '',
		timeSlot: 'Morning (09:00 AM - 12:00 PM)',
		guests: '1-2 People'
	});

	let estimatedShipping = $derived(transportOption === 'Nationwide Hauling' ? 650 : 0);
	let totalPrice = $derived(lot.price + estimatedShipping);

	async function handleInquirySubmit(e) {
		e.preventDefault();
		isSubmitting = true;
		await new Promise((r) => setTimeout(r, 800));
		isSubmitting = false;
		inquirySubmitted = true;
	}

	async function handleVisitSubmit(e) {
		e.preventDefault();
		isSubmitting = true;
		await new Promise((r) => setTimeout(r, 800));
		isSubmitting = false;
		visitSubmitted = true;
	}
</script>

<svelte:head>
	<title>{lot.title} | Pedigree Tree, EPD Metrics & Performance Data</title>
</svelte:head>

<div class="container mx-auto space-y-6 px-3 py-4 sm:px-4 sm:py-8">
	<!-- Top Bar Navigation -->
	<div class="flex items-center justify-between border-b pb-3">
		<a
			href="/catalog"
			class="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			&larr; Back to Catalog
		</a>
		<div class="flex items-center gap-2">
			<Badge variant="outline" class="text-xs">Tag #{lot.tagNumber}</Badge>
			<Badge
				class={lot.status === 'Available'
					? 'bg-emerald-600'
					: lot.status === 'Sold'
						? 'bg-slate-700'
						: 'bg-amber-600'}
			>
				{lot.status}
			</Badge>
		</div>
	</div>

	<!-- MAIN TWO-COLUMN GRID SETUP -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
		<!-- LEFT COLUMN CONTAINER (Desktop col-span-7) -->
		<div class="contents lg:col-span-7 lg:block lg:space-y-6">
			<!-- 1. MEDIA GALLERY (ORDER-1 ON MOBILE) -->
			<div class="order-1 space-y-3">
				<div class="relative overflow-hidden rounded-xl border shadow-sm">
					<Carousel.Root setApi={(api) => (carouselApi = api)} class="w-full">
						<Carousel.Content>
							{#each mediaItems as item, i}
								<Carousel.Item>
									<div class="relative flex aspect-square items-center justify-center bg-slate-950">
										{#if item.type === 'video'}
											<iframe
												class="h-full w-full"
												src={item.src}
												title="{lot.title} Walkthrough Video"
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												allowfullscreen
											></iframe>
										{:else}
											<img
												src={item.src}
												alt="{lot.title} photo {i + 1}"
												class="h-full w-full object-contain"
											/>
										{/if}
									</div>
								</Carousel.Item>
							{/each}
						</Carousel.Content>
						<Carousel.Previous class="left-2 border-0 bg-black/60 text-white hover:bg-black/80" />
						<Carousel.Next class="right-2 border-0 bg-black/60 text-white hover:bg-black/80" />
					</Carousel.Root>

					<div class="pointer-events-none absolute right-3 bottom-3 z-20">
						<Badge class="border-0 bg-black/70 text-[10px] text-white backdrop-blur-xs">
							{currentMedia.type === 'video'
								? 'Video'
								: `${activeMediaIndex + 1} of ${mediaItems.length}`}
						</Badge>
					</div>
				</div>

				<!-- Media Thumbnails -->
				<div class="flex gap-2 overflow-x-auto pb-1">
					{#each mediaItems as item, i}
						<button
							type="button"
							onclick={() => scrollTo(i)}
							class="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all {activeMediaIndex ===
							i
								? 'border-primary shadow-xs'
								: 'border-transparent opacity-60 hover:opacity-100'}"
						>
							{#if item.type === 'video'}
								<div
									class="flex h-full w-full flex-col items-center justify-center bg-slate-900 text-white"
								>
									<span class="text-[10px]">▶</span>
									<span class="text-[7px] font-bold tracking-wider uppercase">Video</span>
								</div>
							{:else}
								<img src={item.src} alt="Thumbnail {i + 1}" class="h-full w-full object-cover" />
							{/if}
						</button>
					{/each}
				</div>
			</div>

			<!-- 3. OVERVIEW & LIGHTWEIGHT PEDIGREE (ORDER-3 ON MOBILE) -->
			<div class="order-3 space-y-6 pt-2 lg:pt-0">
				<!-- Breeder Notes -->
				<Card>
					<CardHeader class="border-b p-4 pb-2.5">
						<CardTitle class="text-base sm:text-lg">Breeder Overview & Notes</CardTitle>
					</CardHeader>
					<CardContent class="p-4 text-xs leading-relaxed font-light text-slate-700 sm:text-sm">
						<p>{lot.description}</p>
					</CardContent>
				</Card>

				<!-- LIGHTWEIGHT CSS PEDIGREE TREE -->
				<Card>
					<CardHeader class="flex flex-row items-center justify-between border-b p-4 pb-2.5">
						<div>
							<CardTitle class="text-base sm:text-lg">Pedigree Lineage Tree</CardTitle>
							<CardDescription class="text-xs">3-Generation Ancestry Diagram</CardDescription>
						</div>
						<Badge variant="outline" class="text-[10px]">Genomic i50K</Badge>
					</CardHeader>
					<CardContent class="p-3 sm:p-4">
						<div class="overflow-x-auto rounded-xl border bg-slate-50/60 p-3">
							<div class="tree-container min-w-[640px] py-2">
								<div class="tree-col">
									<div class="node node-target">
										<span class="node-label">SUBJECT</span>
										<span class="node-title">{lot.title}</span>
									</div>
								</div>

								<div class="tree-col">
									<div class="node node-sire">
										<span class="node-label">SIRE</span>
										<span class="node-title">{lot.pedigree?.sire || 'N/A'}</span>
									</div>
									<div class="node node-dam">
										<span class="node-label">DAM</span>
										<span class="node-title">{lot.pedigree?.dam || 'N/A'}</span>
									</div>
								</div>

								<div class="tree-col">
									<div class="node">
										<span class="node-label font-bold text-blue-600">Paternal Grandsire</span>{lot
											.pedigree?.grandSireSire || 'N/A'}
									</div>
									<div class="node">
										<span class="node-label font-bold text-blue-600">Paternal Granddam</span>{lot
											.pedigree?.grandDamSire || 'N/A'}
									</div>
									<div class="node">
										<span class="node-label font-bold text-slate-700">Maternal Grandsire</span>{lot
											.pedigree?.grandSireDam || 'N/A'}
									</div>
									<div class="node">
										<span class="node-label font-bold text-slate-700">Maternal Granddam</span>{lot
											.pedigree?.grandDamDam || 'N/A'}
									</div>
								</div>

								<div class="tree-col">
									<div class="node node-sm">
										{lot.pedigree?.greatGrandSireSireSire || 'Sire Sire Sire'}
									</div>
									<div class="node node-sm">
										{lot.pedigree?.greatGrandDamSireSire || 'Sire Sire Dam'}
									</div>
									<div class="node node-sm">
										{lot.pedigree?.greatGrandSireSireDam || 'Sire Dam Sire'}
									</div>
									<div class="node node-sm">
										{lot.pedigree?.greatGrandDamSireDam || 'Sire Dam Dam'}
									</div>
									<div class="node node-sm">
										{lot.pedigree?.greatGrandSireDamSire || 'Dam Sire Sire'}
									</div>
									<div class="node node-sm">
										{lot.pedigree?.greatGrandDamDamSire || 'Dam Sire Dam'}
									</div>
									<div class="node node-sm">
										{lot.pedigree?.greatGrandSireDamDam || 'Dam Dam Sire'}
									</div>
									<div class="node node-sm">
										{lot.pedigree?.greatGrandDamDamDam || 'Dam Dam Dam'}
									</div>
								</div>
							</div>
						</div>
						<p class="mt-2 text-center text-[10px] text-muted-foreground sm:hidden">
							&larr; Swipe left/right to view full lineage ancestry &rarr;
						</p>
					</CardContent>
				</Card>

				<!-- CHARTS & DIAGNOSTICS SECTION -->
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<!-- Percentile Bars -->
					<Card>
						<CardHeader class="border-b p-3.5 pb-2">
							<CardTitle class="text-xs font-bold tracking-wider text-slate-700 uppercase"
								>Breed Percentile Ranks</CardTitle
							>
							<CardDescription class="text-[10px]">Higher % = Superior Rank</CardDescription>
						</CardHeader>
						<CardContent class="space-y-3 p-3.5">
							{#if lot.epdPercentilesChart}
								{#each lot.epdPercentilesChart as item}
									<div class="space-y-1">
										<div class="flex justify-between text-xs">
											<span class="font-bold text-slate-800"
												>{item.trait}
												<span class="font-normal text-slate-500">({item.fullName || ''})</span
												></span
											>
											<span class="font-mono text-xs font-bold text-primary">{item.label}</span>
										</div>
										<div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
											<div
												class="h-full rounded-full bg-primary transition-all duration-500"
												style="width: {item.percentile}%"
											></div>
										</div>
									</div>
								{/each}
							{/if}
						</CardContent>
					</Card>

					<!-- Weight Progression Line Chart -->
					<Card>
						<CardHeader class="border-b p-3.5 pb-2">
							<CardTitle class="text-xs font-bold tracking-wider text-slate-700 uppercase"
								>Growth Weight Curve</CardTitle
							>
							<CardDescription class="text-[10px]">Weight milestones in lbs</CardDescription>
						</CardHeader>
						<CardContent class="p-3.5">
							{#if lot.growthWeightChart?.length}
								<div class="relative h-40 w-full pt-1">
									<svg
										class="h-full w-full overflow-visible"
										viewBox="0 0 500 180"
										preserveAspectRatio="xMidYMid meet"
									>
										<line x1="0" y1="30" x2="500" y2="30" stroke="#e2e8f0" stroke-dasharray="4" />
										<line x1="0" y1="90" x2="500" y2="90" stroke="#e2e8f0" stroke-dasharray="4" />
										<line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" stroke-dasharray="4" />

										<polyline
											fill="none"
											stroke="currentColor"
											stroke-width="3"
											class="text-primary"
											points={growthPoints()}
										/>

										{#each lot.growthWeightChart as pt, idx}
											{@const maxW = Math.max(...lot.growthWeightChart.map((d) => d.weight)) * 1.1}
											{@const x = (idx / (lot.growthWeightChart.length - 1)) * 460 + 20}
											{@const y = 180 - (pt.weight / maxW) * 150 - 15}
											<circle cx={x} cy={y} r="5" class="fill-white stroke-primary stroke-[3]" />
											<text
												{x}
												y={y - 10}
												text-anchor="middle"
												class="fill-slate-900 font-mono text-[11px] font-bold"
											>
												{pt.weight}
											</text>
											<text
												{x}
												y="175"
												text-anchor="middle"
												class="fill-slate-500 text-[8px] uppercase sm:text-[9px]"
											>
												{pt.stage}
											</text>
										{/each}
									</svg>
								</div>
							{/if}
						</CardContent>
					</Card>
				</div>

				<!-- EXTENDED DIAGNOSTICS & CARCASS DATA -->
				<Card>
					<CardHeader class="border-b p-4 pb-2.5">
						<CardTitle class="text-base sm:text-lg">Carcass Ultrasound & Genetic Defects</CardTitle>
					</CardHeader>
					<CardContent class="space-y-5 p-4">
						<div class="space-y-2">
							<h4 class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
								Ultrasound Scan Diagnostics
							</h4>
							<div class="overflow-x-auto rounded-lg border">
								<table class="w-full min-w-[320px] text-left text-xs">
									<thead class="border-b bg-slate-100 text-slate-700">
										<tr>
											<th class="p-2 font-semibold">Ribeye (REA)</th>
											<th class="p-2 font-semibold">Fat Thickness</th>
											<th class="p-2 font-semibold">% IMF</th>
											<th class="p-2 font-semibold">Grade</th>
										</tr>
									</thead>
									<tbody class="divide-y font-mono text-slate-900">
										<tr>
											<td class="p-2">{lot.ultrasoundData?.ribeyeAreaSqIn || '14.7'} sq.in</td>
											<td class="p-2">{lot.ultrasoundData?.fatThicknessInches || '0.30'} in</td>
											<td class="p-2">{lot.ultrasoundData?.imfPercentage || '4.9'}%</td>
											<td class="p-2 font-sans font-semibold text-emerald-700">Prime Target</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<!-- Genetic Defect Status -->
						<div class="space-y-2">
							<h4 class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
								Genetic Defect DNA Status
							</h4>
							<div class="grid grid-cols-2 gap-2 font-mono text-xs sm:grid-cols-4">
								<div class="rounded border bg-slate-50 p-2">
									<span class="block font-sans text-[9px] text-muted-foreground"
										>AM (Arthrogryposis)</span
									>
									<span class="font-bold text-emerald-700">AMF (Free)</span>
								</div>
								<div class="rounded border bg-slate-50 p-2">
									<span class="block font-sans text-[9px] text-muted-foreground"
										>NH (Neuropathic)</span
									>
									<span class="font-bold text-emerald-700">NHF (Free)</span>
								</div>
								<div class="rounded border bg-slate-50 p-2">
									<span class="block font-sans text-[9px] text-muted-foreground"
										>CA (Contractural)</span
									>
									<span class="font-bold text-emerald-700">CAF (Free)</span>
								</div>
								<div class="rounded border bg-slate-50 p-2">
									<span class="block font-sans text-[9px] text-muted-foreground"
										>DD (Developmental)</span
									>
									<span class="font-bold text-emerald-700">DDF (Free)</span>
								</div>
							</div>
						</div>

						<!-- Structural Scores -->
						<div class="space-y-2">
							<h4 class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
								Structural Soundness Scores (1-9 Scale)
							</h4>
							<div class="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
								<div class="rounded-lg border bg-slate-50 p-2.5">
									<span class="block text-[9px] font-bold text-slate-500 uppercase"
										>Front Feet Angle</span
									>
									<span class="font-medium text-slate-900"
										>{lot.structuralScores?.frontFeetAngle || '5 (Ideal 45°)'}</span
									>
								</div>
								<div class="rounded-lg border bg-slate-50 p-2.5">
									<span class="block text-[9px] font-bold text-slate-500 uppercase"
										>Rear Claw Set</span
									>
									<span class="font-medium text-slate-900"
										>{lot.structuralScores?.rearLegClawSet || '5 (Symmetrical)'}</span
									>
								</div>
								<div class="rounded-lg border bg-slate-50 p-2.5">
									<span class="block text-[9px] font-bold text-slate-500 uppercase"
										>Docility Score</span
									>
									<span class="font-medium text-slate-900"
										>{lot.structuralScores?.docilityScore || '1 (Quiet Chute)'}</span
									>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Calving & Production History (If Cow/Dam) -->
				{#if lot.damProductionHistory}
					<Card>
						<CardHeader class="border-b p-4 pb-2.5">
							<CardTitle class="text-base sm:text-lg">Dam Production & Calving Record</CardTitle>
						</CardHeader>
						<CardContent class="space-y-3 p-4 text-xs">
							<div class="grid grid-cols-3 gap-2 text-center">
								<div class="rounded border bg-slate-50 p-2">
									<span class="block text-[9px] text-slate-500 uppercase">Calves Weaned</span>
									<span class="text-sm font-bold text-slate-900"
										>{lot.damProductionHistory.calvesWeaned || '4'}</span
									>
								</div>
								<div class="rounded border bg-slate-50 p-2">
									<span class="block text-[9px] text-slate-500 uppercase">Avg Wean Ratio</span>
									<span class="text-sm font-bold text-slate-900"
										>{lot.damProductionHistory.avgWeanRatio || '103'}</span
									>
								</div>
								<div class="rounded border bg-slate-50 p-2">
									<span class="block text-[9px] text-slate-500 uppercase">Calving Interval</span>
									<span class="text-sm font-bold text-slate-900"
										>{lot.damProductionHistory.calvingInterval || '362 Days'}</span
									>
								</div>
							</div>
						</CardContent>
					</Card>
				{/if}

				<!-- FAQs -->
				<Card>
					<CardHeader class="border-b p-4 pb-2.5">
						<CardTitle class="text-base sm:text-lg">Buyer FAQ</CardTitle>
					</CardHeader>
					<CardContent class="space-y-2.5 p-4">
						{#each buyerFaqs as faq, i}
							<div class="overflow-hidden rounded-lg border bg-white">
								<button
									type="button"
									onclick={() => toggleFaq(i)}
									class="flex w-full items-center justify-between p-3 text-left text-xs font-semibold text-slate-900 sm:text-sm"
								>
									<span>{faq.q}</span>
									<span class="ml-2 text-sm font-bold text-primary"
										>{openFaq === i ? '−' : '+'}</span
									>
								</button>
								{#if openFaq === i}
									<div
										class="mt-1 border-t p-3 pt-0 text-xs leading-relaxed font-light text-muted-foreground"
									>
										{faq.a}
									</div>
								{/if}
							</div>
						{/each}
					</CardContent>
				</Card>
			</div>
		</div>

		<!-- 2. RIGHT COLUMN: SUMMARY, PRICE & EPDS (ORDER-2 ON MOBILE, RIGHT SIDE ON DESKTOP) -->
		<div class="order-2 space-y-5 lg:sticky lg:top-20 lg:col-span-5">
			<!-- Header & Pricing -->
			<div class="space-y-1.5 border-b pb-3.5">
				<div class="flex flex-wrap items-center gap-2">
					<Badge variant="outline" class="text-[11px]">Tag #{lot.tagNumber}</Badge>
					<span class="text-xs text-muted-foreground">Reg #{lot.registrationNumber}</span>
				</div>
				<h1 class="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
					{lot.title}
				</h1>
				<p class="text-xs text-muted-foreground sm:text-sm">{lot.breed} • {lot.type}</p>
				<div class="pt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">
					${lot.price.toLocaleString()}
				</div>
			</div>

			<!-- Detailed Specifications Grid -->
			<div class="grid grid-cols-2 gap-2.5 rounded-xl bg-slate-100 p-3 text-xs font-medium">
				<div>
					<span class="block text-[10px] text-muted-foreground uppercase">Date of Birth</span>
					{lot.dob}
				</div>
				<div>
					<span class="block text-[10px] text-muted-foreground uppercase">Current Weight</span>
					{lot.weight}
				</div>
				<div>
					<span class="block text-[10px] text-muted-foreground uppercase">Frame Size</span>
					{lot.frameSize}
				</div>
				<div>
					<span class="block text-[10px] text-muted-foreground uppercase">Scrotal</span>
					{lot.scrotalCircumference || 'N/A'}
				</div>
				<div>
					<span class="block text-[10px] text-muted-foreground uppercase">DNA Profile</span>
					{lot.dnaProfile || 'Genomic Enhanced'}
				</div>
				<div>
					<span class="block text-[10px] text-muted-foreground uppercase">Polled Status</span>
					{lot.polledStatus || 'Homozygous Polled'}
				</div>
				<div class="col-span-2 border-t border-slate-200/80 pt-2">
					<span class="block text-[10px] text-muted-foreground uppercase"
						>Breeding Soundness / Fertility</span
					>
					<span class="font-bold text-slate-900">{lot.semenMotility || lot.pregnancyStatus}</span>
				</div>
				<div class="col-span-2 border-t border-slate-200/80 pt-2">
					<span class="block text-[10px] text-muted-foreground uppercase">Health Guarantees</span>
					<span class="text-slate-700">{lot.healthStatus || 'BVD-PI Free, Vaccinated'}</span>
				</div>
			</div>

			<!-- Action Buttons -->
			{#if lot.status === 'Available'}
				<div class="space-y-2 pt-1">
					<Button
						class="w-full py-5 text-sm font-semibold shadow-xs"
						onclick={() => (showInquiryModal = true)}
					>
						Inquire / Get Instant Quote
					</Button>
					<Button
						onclick={() => (showVisitModal = true)}
						variant="outline"
						class="w-full py-4 text-xs sm:py-5 sm:text-sm"
					>
						Schedule On-Ranch Inspection
					</Button>
				</div>
			{:else}
				<Button disabled variant="secondary" class="w-full py-5">This Lot Has Been Sold</Button>
			{/if}

			<!-- EPD Data Table -->
			<Card>
				<CardHeader class="border-b p-3.5 pb-2">
					<CardTitle class="text-xs font-bold tracking-wider text-slate-700 uppercase sm:text-sm">
						Expected Progeny Differences (EPD / EBV)
					</CardTitle>
				</CardHeader>
				<CardContent class="p-3">
					<div class="overflow-x-auto rounded-lg border">
						<table class="w-full text-center text-xs">
							<thead class="border-b bg-slate-100">
								<tr>
									<th class="p-2 text-left font-semibold">Trait Metric</th>
									<th class="p-2 font-semibold">Score</th>
								</tr>
							</thead>
							<tbody class="divide-y font-medium text-slate-800">
								<tr>
									<td class="p-2 text-left font-normal text-muted-foreground"
										>Calving Ease Direct (CED)</td
									>
									<td class="p-2 font-bold text-slate-900">{lot.epv.calvingEase}</td>
								</tr>
								<tr>
									<td class="p-2 text-left font-normal text-muted-foreground">Birth Weight (BW)</td>
									<td class="p-2 font-bold text-slate-900">{lot.epv.birthWeight}</td>
								</tr>
								<tr>
									<td class="p-2 text-left font-normal text-muted-foreground"
										>Weaning Weight (WW)</td
									>
									<td class="p-2 font-bold text-slate-900">{lot.epv.weaningWeight}</td>
								</tr>
								<tr>
									<td class="p-2 text-left font-normal text-muted-foreground"
										>Yearling Weight (YW)</td
									>
									<td class="p-2 font-bold text-slate-900">{lot.epv.yearlingWeight}</td>
								</tr>
								<tr>
									<td class="p-2 text-left font-normal text-muted-foreground">Maternal Milk</td>
									<td class="p-2 font-bold text-slate-900">{lot.epv.milk}</td>
								</tr>
								<tr>
									<td class="p-2 text-left font-normal text-muted-foreground"
										>Intramuscular Fat (Marbling)</td
									>
									<td class="p-2 font-bold text-slate-900">{lot.epv.marbling}</td>
								</tr>
								<tr>
									<td class="p-2 text-left font-normal text-muted-foreground">Ribeye Area (REA)</td>
									<td class="p-2 font-bold text-slate-900">{lot.epv.ribeyeArea}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			<!-- Digital QR Pass -->
			<div
				class="flex items-center gap-4 rounded-xl border bg-card p-3.5 shadow-sm transition-all hover:border-slate-300"
			>
				<div class="relative shrink-0">
					<img
						src={qrCodeUrl}
						alt="QR Code for {lot.title}"
						width="96"
						height="96"
						loading="lazy"
						class="h-24 w-24 rounded-lg border bg-white p-1.5 shadow-xs"
					/>
				</div>

				<div class="flex flex-1 flex-col self-stretch py-0.5">
					<div class="space-y-1">
						<div class="flex items-center gap-1.5">
							<span class="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
							<p class="text-xs font-bold text-slate-900">Digital Pedigree Pass</p>
						</div>
						<p class="text-[11px] leading-relaxed text-muted-foreground">
							Scan during ranch inspection or share for instant breed verification.
						</p>
					</div>

					<div class="mt-2 flex items-center gap-2">
						<Button
							type="button"
							onclick={copyToClipboard}
							class="relative inline-flex items-center gap-1.5 transition-all duration-200 {copied
								? 'bg-emerald-600 text-white hover:bg-emerald-700'
								: ''}"
						>
							{#if copied}
								<svg
									class="h-3 w-3 animate-in duration-200 zoom-in-50"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2.5"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span class="animate-in duration-200 fade-in slide-in-from-bottom-1">Copied!</span>
							{:else}
								<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
								<span>Copy Link</span>
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Modal Dialog -->
<!-- INQUIRY / PURCHASE DIALOG (In-Page Modal) -->
<Dialog.Root bind:open={showInquiryModal}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-base font-bold"
				>Inquiry & Purchase Desk — Tag #{lot.tagNumber}</Dialog.Title
			>
			<Dialog.Description class="text-xs">
				Submit details below to lock reserve pricing, confirm transport logistics, or clear pedigree
				certificates.
			</Dialog.Description>
		</Dialog.Header>

		{#if inquirySubmitted}
			<div class="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
				<div
					class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<div>
					<h3 class="text-sm font-bold text-emerald-900">Inquiry Dispatched Successfully</h3>
					<p class="mt-1 text-xs leading-relaxed text-emerald-700">
						Thank you, <span class="font-semibold">{inquiryForm.name}</span>. Our ranch manager has
						logged your inquiry for <span class="font-semibold">{lot.title}</span> and will reach out
						shortly.
					</p>
				</div>
				<Button
					variant="outline"
					size="lg"
					onclick={() => {
						inquirySubmitted = false;
						showInquiryModal = false;
					}}
				>
					Close Window
				</Button>
			</div>
		{:else}
			<form onsubmit={handleInquirySubmit} class="space-y-3 pt-2">
				<div class="space-y-1">
					<label
						for="inq-type"
						class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
						>Inquiry Focus</label
					>
					<select
						id="inq-type"
						bind:value={inquiryType}
						class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
					>
						<option value="Reserve Price / Purchase"
							>Reserve Price / Direct Purchase (${lot.price.toLocaleString()})</option
						>
						<option value="Pedigree / Health Verification"
							>Pedigree & Health / BSE Records Question</option
						>
						<option value="Transport Coordination"
							>Transport & Interstate Export Coordination</option
						>
					</select>
				</div>

				<div class="space-y-1">
					<label
						for="inq-name"
						class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
						>Full Name</label
					>
					<Input
						id="inq-name"
						required
						bind:value={inquiryForm.name}
						placeholder="John Doe"
						class="text-xs"
					/>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<div class="space-y-1">
						<label
							for="inq-phone"
							class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
							>Phone</label
						>
						<Input
							id="inq-phone"
							type="tel"
							required
							bind:value={inquiryForm.phone}
							placeholder="(555) 019-2834"
							class="text-xs"
						/>
					</div>
					<div class="space-y-1">
						<label
							for="inq-email"
							class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
							>Email</label
						>
						<Input
							id="inq-email"
							type="email"
							required
							bind:value={inquiryForm.email}
							placeholder="john@example.com"
							class="text-xs"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<label
						for="inq-msg"
						class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
						>Message / Custom Delivery Notes</label
					>
					<textarea
						id="inq-msg"
						rows="3"
						required
						bind:value={inquiryForm.message}
						class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
						placeholder="Inquiring about transfer process or hauling arrangements..."></textarea>
				</div>

				<div class="pt-2">
					<Button
						type="submit"
						disabled={isSubmitting}
						class="w-full bg-emerald-700  text-white hover:bg-emerald-800"
						size="lg"
					>
						{#if isSubmitting}
							Transmitting Request...
						{:else}
							Submit Official Lot Inquiry
						{/if}
					</Button>
				</div>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>

<!-- VISIT SCHEDULER DIALOG (In-Page Modal) -->
<Dialog.Root bind:open={showVisitModal}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-base font-bold">Schedule Ranch Viewing — {lot.title}</Dialog.Title>
			<Dialog.Description class="text-xs">
				Inspect this sire live at our Bozeman headquarters facility. Select your preferred date and
				time slot.
			</Dialog.Description>
		</Dialog.Header>

		{#if visitSubmitted}
			<div class="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
				<div
					class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<div>
					<h3 class="text-sm font-bold text-emerald-900">Viewing Appointment Confirmed</h3>
					<p class="mt-1 text-xs leading-relaxed text-emerald-700">
						Thank you, <span class="font-semibold">{visitForm.name}</span>. We have booked your
						inspection tour for <span class="font-semibold">{visitForm.date}</span>. GPS gate entry
						codes will be sent via email.
					</p>
				</div>
				<Button
					variant="outline"
					size="lg"
					onclick={() => {
						visitSubmitted = false;
						showVisitModal = false;
					}}
				>
					Close Window
				</Button>
			</div>
		{:else}
			<form onsubmit={handleVisitSubmit} class="space-y-3 pt-2">
				<div class="space-y-1">
					<label
						for="visit-name"
						class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
						>Full Name</label
					>
					<Input
						id="visit-name"
						required
						bind:value={visitForm.name}
						placeholder="John Doe"
						class="text-xs"
					/>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<div class="space-y-1">
						<label
							for="visit-phone"
							class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
							>Phone</label
						>
						<Input
							id="visit-phone"
							type="tel"
							required
							bind:value={visitForm.phone}
							placeholder="(555) 019-2834"
							class="text-xs"
						/>
					</div>
					<div class="space-y-1">
						<label
							for="visit-email"
							class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
							>Email</label
						>
						<Input
							id="visit-email"
							type="email"
							required
							bind:value={visitForm.email}
							placeholder="john@example.com"
							class="text-xs"
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<div class="space-y-1">
						<label
							for="visit-date"
							class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
							>Preferred Date</label
						>
						<Input
							id="visit-date"
							type="date"
							required
							bind:value={visitForm.date}
							class="text-xs"
						/>
					</div>
					<div class="space-y-1">
						<label
							for="visit-slot"
							class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
							>Time Slot</label
						>
						<select
							id="visit-slot"
							bind:value={visitForm.timeSlot}
							class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
						>
							<option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
							<option value="Afternoon (01:00 PM - 04:00 PM)"
								>Afternoon (01:00 PM - 04:00 PM)</option
							>
						</select>
					</div>
				</div>

				<div class="pt-2">
					<Button type="submit" size="lg" disabled={isSubmitting} class="w-full">
						{#if isSubmitting}
							Scheduling Appointment...
						{:else}
							Confirm Ranch Inspection Booking
						{/if}
					</Button>
				</div>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>

<style>
	/* Lightweight Tree Layout */
	.tree-container {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		justify-content: space-between;
	}
	.tree-col {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		gap: 0.5rem;
		height: 100%;
		flex: 1;
	}
	.node {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		padding: 0.375rem 0.5rem;
		font-size: 0.65rem;
		color: #334155;
		position: relative;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.node-target {
		background: #0f172a;
		color: #ffffff;
		border-color: #0f172a;
		padding: 0.6rem 0.75rem;
	}
	.node-sire {
		border-color: #2563eb;
		background: #eff6ff;
	}
	.node-dam {
		border-color: #64748b;
		background: #f8fafc;
	}
	.node-sm {
		font-size: 0.6rem;
		padding: 0.25rem 0.375rem;
	}
	.node-label {
		display: block;
		font-size: 0.55rem;
		text-transform: uppercase;
		opacity: 0.8;
	}
	.node-title {
		font-weight: 700;
		display: block;
	}
</style>
