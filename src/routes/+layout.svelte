<script>
	import './layout.css';
	let { children } = $props();

	// Mobile menu toggle state (Svelte 5 rune)
	let isMobileMenuOpen = $state(false);

	function toggleMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMenu() {
		isMobileMenuOpen = false;
	}
</script>

<svelte:head>
	<title>Apex Stud Farm Demo | Premium Registered Genetics</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
	<header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<a href="/" onclick={closeMenu} class="z-50 flex flex-col">
				<span class="text-lg font-bold tracking-tight text-primary sm:text-xl"
					>APEX STUD FARM (DEMO)</span
				>
				<span class="text-[10px] text-muted-foreground sm:text-xs"
					>Registered Cattle Genetics & Stud Sales</span
				>
			</a>

			<nav class="hidden items-center gap-6 text-sm font-medium md:flex">
				<a href="/" class="transition-colors hover:text-primary">Home</a>
				<a href="/catalog" class="transition-colors hover:text-primary">Sales Catalog</a>
				<a href="/about" class="transition-colors hover:text-primary">About Stud</a>
				<a
					href="/contact"
					class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
				>
					Enquire / Visit
				</a>
			</nav>

			<button
				type="button"
				onclick={toggleMenu}
				aria-label="Toggle navigation menu"
				aria-expanded={isMobileMenuOpen}
				class="z-50 inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none md:hidden"
			>
				<svg
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					{#if isMobileMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					{/if}
				</svg>
			</button>
		</div>

		{#if isMobileMenuOpen}
			<button
				type="button"
				onclick={closeMenu}
				tabindex="-1"
				aria-label="Close menu backdrop"
				class="fixed inset-0 top-16 z-30 bg-black/40 backdrop-blur-sm md:hidden"
			></button>

			<div
				class="absolute top-16 right-0 left-0 z-40 border-b bg-background p-6 shadow-xl md:hidden"
			>
				<nav class="flex flex-col gap-4 text-base font-medium">
					<a
						href="/"
						onclick={closeMenu}
						class="border-b border-slate-100 py-2 transition-colors hover:text-primary">Home</a
					>
					<a
						href="/catalog"
						onclick={closeMenu}
						class="border-b border-slate-100 py-2 transition-colors hover:text-primary"
						>Sales Catalog</a
					>
					<a
						href="/about"
						onclick={closeMenu}
						class="border-b border-slate-100 py-2 transition-colors hover:text-primary"
						>About Stud</a
					>
					<a
						href="/contact"
						onclick={closeMenu}
						class="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
					>
						Enquire / Visit
					</a>
				</nav>
			</div>
		{/if}
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t bg-background py-6 text-xs text-muted-foreground">
		<div
			class="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-start"
		>
			<div>
				<p class="font-semibold text-foreground">Apex Stud Farm & Genetics Demo</p>
				<p>PIC: 3ABC1234 | Member of National Angus & Brahman Associations</p>
			</div>
			<p>
				&copy; 2026 Apex Livestock Demo. Built by <a
					href="https://www.kbstack.com"
					class="font-bold underline">KBStack</a
				>
			</p>
		</div>
	</footer>
</div>
