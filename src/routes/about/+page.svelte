<script>
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	const stats = [
		{ label: 'Years of Breeding Excellence', value: '25+' },
		{ label: 'Registered Herd Sires', value: '150+' },
		{ label: 'BVD-PI & Health Certified', value: '100%' },
		{ label: 'States Exported To', value: '38' }
	];

	const pillars = [
		{
			number: '01',
			title: 'Genomic Verification',
			description:
				'100% DNA parentage verified with high-accuracy EPD percentiles for predictable breeding outcomes.'
		},
		{
			number: '02',
			title: 'Pasture Rigor',
			description:
				'Sires and females raised in working conditions to guarantee feet correctness and maternal longevity.'
		},
		{
			number: '03',
			title: 'Ultrasound Evaluated',
			description:
				'Certified scan metrics for Ribeye Area (REA), Fat Thickness, and Intramuscular Fat (% IMF).'
		},
		{
			number: '04',
			title: 'Soundness Guarantee',
			description:
				'Every bull completes a thorough physical exam, scrotal measurement, and semen motility test before delivery.'
		}
	];
</script>

<div class="space-y-20 py-8 md:py-16">
	<section class="container mx-auto max-w-4xl space-y-6 px-4 text-center">
		<div class="inline-flex items-center gap-2">
			<Badge
				variant="outline"
				class="rounded-full border-primary/30 bg-primary/5 px-4 py-1 text-xs tracking-widest text-primary uppercase"
			>
				Established 1999
			</Badge>
		</div>

		<h1
			class="text-4xl leading-[1.15] font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl"
		>
			Pioneering Seedstock Genetics & Uncompromised Quality
		</h1>

		<p
			class="mx-auto max-w-2xl text-base leading-relaxed font-light text-muted-foreground sm:text-lg md:text-xl"
		>
			Dedicated to producing structurally correct, docile, and high-performing registered cattle
			engineered for the modern commercial producer.
		</p>
	</section>

	<section class="container mx-auto px-4">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
			<div class="relative lg:col-span-7">
				<div
					class="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-slate-900 shadow-2xl"
				>
					<img
						src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=80"
						alt="Pasture Herds at Apex Livestock"
						class="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
					/>
				</div>
				<div
					class="absolute -right-6 -bottom-6 hidden max-w-xs space-y-1 rounded-xl border bg-background/95 p-5 shadow-xl backdrop-blur-md sm:block"
				>
					<p class="text-xs font-semibold tracking-wider text-primary uppercase">
						Unassisted Calving Rate
					</p>
					<p class="text-2xl font-bold text-foreground">98.4%</p>
					<p class="text-[11px] text-muted-foreground">Across all first-calf heifer progeny.</p>
				</div>
			</div>

			<div class="space-y-6 lg:col-span-5">
				<div class="space-y-2">
					<span class="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
						>Our Philosophy</span
					>
					<h2 class="text-3xl font-semibold tracking-tight text-foreground">
						Bred for the Pasture, Proven by Numbers
					</h2>
				</div>

				<div class="space-y-4 text-sm leading-relaxed font-light text-muted-foreground">
					<p>
						At Apex Livestock, we believe stud cattle should thrive in working pasture environments
						without artificial pampering. Our breeding program balances real-world structural
						correctness with cutting-edge genomic data.
					</p>
					<p>
						By strictly culling for foot angle, claw set, udder attachment, and docility, we deliver
						predictable bulls and replacement females that stand up to harsh environmental demands
						while maximizing weaning pay-weight.
					</p>
				</div>

				<div class="pt-2">
					<Button
						href="/catalog"
						variant="outline"
						class="rounded-full border-foreground/20 px-6 transition-colors hover:bg-foreground hover:text-background"
					>
						Explore Active Catalog
					</Button>
				</div>
			</div>
		</div>
	</section>

	<section class="border-y bg-muted/30 py-12">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
				{#each stats as stat}
					<div class="space-y-1">
						<p class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							{stat.value}
						</p>
						<p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
							{stat.label}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="container mx-auto space-y-12 px-4">
		<div class="mx-auto max-w-xl space-y-3 text-center">
			<span class="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
				>Standard of Integrity</span
			>
			<h2 class="text-3xl font-semibold tracking-tight">Our Quality Assurance</h2>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each pillars as pillar}
				<Card
					class="border/60 relative overflow-hidden bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
				>
					<CardContent class="space-y-4 p-6">
						<span class="block text-3xl font-light text-primary/40">{pillar.number}</span>
						<h3 class="text-lg font-semibold tracking-tight text-foreground">
							{pillar.title}
						</h3>
						<p class="text-xs leading-relaxed font-light text-muted-foreground">
							{pillar.description}
						</p>
					</CardContent>
				</Card>
			{/each}
		</div>
	</section>

	<section class="container mx-auto px-4">
		<div
			class="relative overflow-hidden rounded-3xl border bg-slate-950 p-8 text-slate-50 shadow-2xl sm:p-12 md:p-16"
		>
			<div
				class="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
			></div>

			<div class="relative z-10 max-w-2xl space-y-6">
				<Badge
					class="border-primary/30 bg-primary/20 text-[10px] tracking-widest text-primary-foreground uppercase"
				>
					Private Treaty & Auction Visits
				</Badge>

				<h3 class="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
					Schedule Your On-Ranch Herd Inspection
				</h3>

				<p class="text-sm leading-relaxed font-light text-slate-300 sm:text-base">
					Visitors are always welcome to view our herd sires, prospective bulls, and replacement
					females in person.
				</p>

				<div class="flex flex-col gap-4 pt-2 sm:flex-row">
					<Button href="/contact" size="lg">Book Farm Visit</Button>
					<Button href="/catalog" size="lg" variant="outline">View Livestock Lots</Button>
				</div>
			</div>
		</div>
	</section>
</div>
