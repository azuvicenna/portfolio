<template>
    <section id="home" class="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
                class="relative bg-hero border border-neutral-300 rounded-3xl p-6 sm:p-12 lg:p-16 shadow-soft-xl overflow-hidden">
                <div class="absolute inset-0 opacity-20 pointer-events-none"
                    style="background-image:radial-gradient(#1e293b 1px,transparent 1px);background-size:24px 24px">
                </div>

                <!-- Widget melayang (hanya desktop lebar) -->
                <div
                    class="hidden lg:block absolute bg-white/90 backdrop-blur border border-neutral-200/90 rounded-2xl p-4 shadow-float widget-card z-20 top-8 left-8 w-52">
                    <div class="flex items-center space-x-2 mb-2"><span
                            class="w-2 h-2 rounded-full bg-brand-500"></span><span
                            class="text-xs font-bold text-neutral-800">Lokasi</span></div>
                    <p class="text-sm font-extrabold">Ciamis, Indonesia</p>
                    <div class="mt-3 text-[10px] font-bold text-neutral-400 border-t border-neutral-100 pt-1.5">Terbuka
                        untuk remote</div>
                </div>
                <div
                    class="hidden lg:block absolute bg-white/90 backdrop-blur border border-neutral-200/90 rounded-2xl p-4 shadow-float widget-card z-20 top-8 right-8 w-56">
                    <div class="flex justify-between items-center mb-2"><span
                            class="text-xs font-extrabold text-neutral-700">Stack utama</span><span
                            class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Aktif</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                        <span v-for="t in ['Laravel', 'Vue', 'TypeScript']" :key="t"
                            class="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800">{{ t
                            }}</span>
                    </div>
                </div>
                <div
                    class="hidden lg:block absolute bg-white/90 backdrop-blur border border-neutral-200/90 rounded-2xl p-4 shadow-float widget-card z-20 bottom-8 left-10 w-52">
                    <div class="flex items-center space-x-2 mb-1.5"><span
                            class="w-2 h-2 rounded-full bg-blue-500"></span><span
                            class="text-xs font-bold text-neutral-800">Pendidikan Saat ini</span></div>
                    <p class="text-[11px] font-medium text-neutral-500">S1 Sistem Informasi</p>
                    <p class="text-[11px] font-bold text-neutral-800">Universitas BSI</p>
                </div>
                <div
                    class="hidden lg:block absolute bg-white/90 backdrop-blur border border-neutral-200/90 rounded-2xl p-4 shadow-float widget-card z-20 bottom-8 right-10 w-56">
                    <div class="flex items-center justify-between mb-2"><span
                            class="text-[11px] font-bold text-neutral-700">Pengalaman terakhir</span><span
                            class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800">2025</span>
                    </div>
                    <p class="text-xs font-black">Software Developer</p>
                    <p class="text-[11px] text-neutral-400">Diskominfo Kota Tasikmalaya</p>
                </div>

                <div class="text-center max-w-2xl mx-auto py-6 sm:py-12 relative z-10">
                    <div
                        class="inline-flex items-center space-x-2 bg-white/80 border border-neutral-300 rounded-full px-3.5 py-1.5 mb-6 shadow-sm">
                        <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                        <span class="text-xs font-bold text-neutral-700 uppercase tracking-wide">Terbuka untuk peluang kerja</span>
                    </div>
                    <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] mb-6">
                        Atyla Azfa <br class="hidden sm:inline" /><span
                            class="underline decoration-brand-500/40 underline-offset-8">Al Harits</span>
                    </h1>
                    <p class="text-neutral-600 text-sm sm:text-lg leading-relaxed font-medium mb-8 max-w-xl mx-auto">
                        Software developer yang membangun aplikasi web dan mobile dengan Laravel, Vue, dan TypeScript.</p>
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="CV_ID_Atyla_Azfa_Al_Harits.pdf" download
                            class="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95">Download
                            CV</a>
                        <a href="https://github.com/azuvicenna" target="_blank" rel="noopener"
                            class="w-full sm:w-auto bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-sm px-8 py-3.5 rounded-xl border border-neutral-300 shadow-sm transition">GitHub</a>
                    </div>
                    <div
                        class="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-neutral-500">
                        <span>•</span><span>Ciamis, Indonesia</span><span>•</span><span>D3/S1 Sistem
                            Informasi</span><span>•</span><span>Software Developer</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>