<script>
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import siteConfig from '$lib/data/site-config';

	let tagParam = $derived(page.url.searchParams.get('tag') || '');
	let submitted = $state(false);
	let isSubmitting = $state(false);

	let formData = $state({
		name: '',
		phone: '',
		email: '',
		inquiryType: 'Reserve Price / Purchase',
		interestedTag: tagParam,
		message: ''
	});

	async function handleSubmit(event) {
		event.preventDefault();
		isSubmitting = true;
		await new Promise((resolve) => setTimeout(resolve, 800));
		isSubmitting = false;
		submitted = true;
	}

	function resetForm() {
		submitted = false;
		formData = {
			name: '',
			phone: '',
			email: '',
			inquiryType: 'Reserve Price / Purchase',
			interestedTag: tagParam,
			message: ''
		};
	}
</script>

<div class="container mx-auto space-y-12 px-4 py-12">
	<!-- Header Section -->
	<div class="mx-auto max-w-2xl space-y-2 text-center">
		<div
			class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
		>
			<span class="h-2 w-2 animate-pulse rounded-full bg-emerald-600"></span>
			Direct Stud Desk & Operations
		</div>
		<h1 class="text-4xl font-extrabold tracking-tight">Get in Touch with Apex Livestock</h1>
		<p class="text-sm leading-relaxed text-muted-foreground">
			Whether you are looking to secure elite terminal sires, schedule a private ranch tour, or
			inquire about multi-state livestock transport, our team is ready to assist.
		</p>
	</div>

	<!-- Main Grid: Info & Form -->
	<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
		<!-- Left Column: Business Info & Map (Span 1) -->
		<div class="space-y-6 lg:col-span-1">
			<!-- Contact Card -->
			<Card class="border-slate-200 shadow-sm">
				<CardHeader class="pb-3">
					<CardTitle class="text-base font-bold">Direct Contacts</CardTitle>
					<CardDescription class="text-xs"
						>Reach out to our field managers directly.</CardDescription
					>
				</CardHeader>
				<CardContent class="space-y-4 text-xs">
					<div class="flex items-start gap-3">
						<div class="mt-0.5 rounded-full bg-slate-100 p-2 text-primary">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
						</div>
						<div>
							<p class="font-bold text-slate-900">Main Office & Sales Desk</p>
							<p class="mt-0.5 text-muted-foreground">(555) 839-2019 / (555) 492-8100</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div class="mt-0.5 rounded-full bg-slate-100 p-2 text-primary">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<div>
							<p class="font-bold text-slate-900">Email Inquiries</p>
							<p class="mt-0.5 text-muted-foreground">{siteConfig.supportEmail}</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div class="mt-0.5 rounded-full bg-slate-100 p-2 text-primary">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<p class="font-bold text-slate-900">Operational Hours</p>
							<p class="mt-0.5 text-muted-foreground">
								Mon – Sat: 7:00 AM – 6:00 PM CST<br />Sunday: By Appointment Only
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Location & Logistics Card with Embedded Map -->
			<Card class="overflow-hidden border-slate-200 shadow-sm">
				<CardHeader class="pb-3">
					<CardTitle class="text-base font-bold">Ranch Headquarters</CardTitle>
					<CardDescription class="text-xs">Primary breeding and viewing facility.</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4 p-0 text-xs">
					<div class="flex items-start gap-3 px-6">
						<div class="mt-0.5 shrink-0 rounded-full bg-slate-100 p-2 text-primary">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
						<div>
							<p class="font-bold text-slate-900">Apex Valley Ranch</p>
							<p class="mt-0.5 text-muted-foreground">
								7402 Heritage Range Road<br />Bozeman, MT 59715
							</p>
						</div>
					</div>

					<!-- Embedded Map Container -->
					<div class="relative h-48 w-full border-y bg-slate-100">
						<iframe
							title="Apex Valley Ranch Map"
							src="https://maps.google.com/maps?q=45.3549857,-117.2772279&z=14&output=embed"
							,
							width="100%"
							height="100%"
							style="border:0;"
							allowfullscreen=""
							loading="lazy"
							referrerpolicy="no-referrer-when-downgrade"
							class="h-full w-full opacity-90 contrast-125"
						></iframe>
					</div>

					<div class="px-6 pt-1 pb-6">
						<div
							class="rounded-lg border bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600"
						>
							<strong class="mb-1 block text-slate-900">Logistics Note:</strong>
							Certified livestock transit coordinates provided upon verified inspection appointment confirmation.
							Accredited interstate health papers issued on-site.
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Right Column: Inquiry Form (Span 2) -->
		<div class="lg:col-span-2">
			<Card class="w-full border-slate-200 shadow-sm">
				<CardHeader class="rounded-t-xl border-b bg-slate-50/50 pb-4">
					<CardTitle class="text-xl font-bold">Submit a Stud or Reserve Inquiry</CardTitle>
					<CardDescription class="text-xs">
						Complete the form below to connect directly with our livestock coordinators.
					</CardDescription>
				</CardHeader>
				<CardContent class="pt-6">
					{#if submitted}
						<div
							class="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-8 text-center"
						>
							<div
								class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
							>
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2.5"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<div>
								<h3 class="text-base font-bold text-emerald-900">
									Inquiry Dispatched Successfully
								</h3>
								<p class="mx-auto mt-1 max-w-md text-xs leading-relaxed text-emerald-700">
									Thank you, <span class="font-semibold">{formData.name}</span>. Our ranch manager
									has logged your inquiry regarding lot
									<span class="font-mono font-semibold"
										>{formData.interestedTag || 'General Catalog'}</span
									> and will follow up shortly.
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								onclick={resetForm}
								class="mt-2 border-emerald-300 text-xs text-emerald-800 hover:bg-emerald-100"
							>
								Submit Another Inquiry
							</Button>
						</div>
					{:else}
						<form onsubmit={handleSubmit} class="space-y-4">
							<div class="space-y-1.5">
								<label
									for="inquiry-type"
									class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
									>Inquiry Focus</label
								>
								<select
									id="inquiry-type"
									bind:value={formData.inquiryType}
									class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
								>
									<option value="Reserve Price / Purchase">Reserve Price / Direct Purchase</option>
									<option value="Paddock Inspection">Schedule Ranch / Paddock Inspection</option>
									<option value="Pedigree / EPD Verification"
										>Pedigree & Genomic Verification Question</option
									>
									<option value="Transport / Delivery">Transport & Export Logistics</option>
								</select>
							</div>

							<div class="space-y-1.5">
								<label
									for="name"
									class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
									>Full Name</label
								>
								<Input
									id="name"
									required
									bind:value={formData.name}
									placeholder="John Doe"
									class="text-xs"
								/>
							</div>

							<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div class="space-y-1.5">
									<label
										for="phone"
										class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
										>Phone Number</label
									>
									<Input
										id="phone"
										type="tel"
										required
										bind:value={formData.phone}
										placeholder="(555) 019-2834"
										class="text-xs"
									/>
								</div>
								<div class="space-y-1.5">
									<label
										for="email"
										class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
										>Email Address</label
									>
									<Input
										id="email"
										type="email"
										required
										bind:value={formData.email}
										placeholder="john@example.com"
										class="text-xs"
									/>
								</div>
							</div>

							<div class="space-y-1.5">
								<label
									for="tag"
									class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
									>Primary Lot or Tag Number <span class="font-normal text-slate-400"
										>(Optional)</span
									></label
								>
								<Input
									id="tag"
									bind:value={formData.interestedTag}
									placeholder="e.g. US-770V"
									class="font-mono text-xs"
								/>
							</div>

							<div class="space-y-1.5">
								<label
									for="msg"
									class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
									>Specific Details or Questions</label
								>
								<textarea
									id="msg"
									rows="4"
									required
									bind:value={formData.message}
									class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
									placeholder="Inquiring about transfer process, semen test verification, or delivery timeline..."
								></textarea>
							</div>

							<Button type="submit" size="lg" disabled={isSubmitting} class="mt-2 w-full">
								{#if isSubmitting}
									<svg
										class="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Transmitting Inquiry...
								{:else}
									Submit Official Inquiry
								{/if}
							</Button>
						</form>
					{/if}
				</CardContent>
			</Card>
		</div>
	</div>
</div>
