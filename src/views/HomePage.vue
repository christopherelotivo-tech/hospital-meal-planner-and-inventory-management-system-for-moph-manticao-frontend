<template>
  <div class="min-h-screen flex flex-col w-full bg-white text-gray-800">
    <!-- Section A: Header (Navigation Bar) -->
    <header class="bg-white border-b border-gray-100 shadow-sm w-full sticky top-0 z-50">
      <div class="py-4 px-4 md:px-8">
        <div class="max-w-[94%] mx-auto flex items-center justify-between w-full">
          <div class="flex items-center gap-2.5 sm:gap-3">
            <img src="@/assets/hospital-seal.png" alt="Hospital Logo" class="h-8 w-8 md:h-10 md:w-10 shrink-0" />
            <div>
              <h1 class="font-candal text-[#2D5F3F] text-xs sm:text-sm md:text-base font-bold leading-tight">Misamis Oriental Provincial Hospital - Manticao</h1>
              <p class="font-dm-sans text-[9px] sm:text-[11px] md:text-xs text-gray-500">9024, Poblacion Manticao, Misamis Oriental</p>
            </div>
          </div>
          <nav class="hidden md:flex gap-8 items-center">
            <a href="#features" class="relative font-candal text-gray-700 hover:text-[#2D5F3F] text-xs md:text-sm font-semibold transition-colors pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#2D5F3F] after:transition-all after:duration-300 hover:after:w-full">Features</a>
            <a href="#contact" class="relative font-candal text-gray-700 hover:text-[#2D5F3F] text-xs md:text-sm font-semibold transition-colors pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#2D5F3F] after:transition-all after:duration-300 hover:after:w-full">Contact Us</a>
            <a href="#" @click.prevent="isAboutOpen = true" class="relative font-candal text-gray-700 hover:text-[#2D5F3F] text-xs md:text-sm font-semibold transition-colors pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#2D5F3F] after:transition-all after:duration-300 hover:after:w-full">About the System</a>
          </nav>

          <!-- Hamburger Button -->
          <button @click="isMenuOpen = !isMenuOpen" class="block md:hidden text-gray-700 hover:text-[#2D5F3F] focus:outline-none" aria-label="Toggle Menu">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Dropdown -->
      <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-gray-100 py-3 px-6 shadow-inner transition-all duration-300">
        <nav class="flex flex-col gap-2">
          <a href="#features" @click="isMenuOpen = false" class="font-candal text-gray-700 hover:text-[#2D5F3F] text-xs sm:text-sm font-semibold py-2 border-b border-gray-50">Features</a>
          <a href="#contact" @click="isMenuOpen = false" class="font-candal text-gray-700 hover:text-[#2D5F3F] text-xs sm:text-sm font-semibold py-2 border-b border-gray-50">Contact Us</a>
          <a href="#" @click.prevent="isAboutOpen = true; isMenuOpen = false" class="font-candal text-gray-700 hover:text-[#2D5F3F] text-xs sm:text-sm font-semibold py-2">About the System</a>
        </nav>
      </div>
    </header>

    <!-- Section B: Hero Section -->
    <section class="relative flex flex-col items-center justify-center text-center py-16 px-4 md:py-32 overflow-hidden min-h-[500px] md:min-h-[700px]">
      <!-- Background Image -->
      <div 
        class="absolute inset-0 z-0"
        :style="{ backgroundImage: `url(${hospitalBg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }"
      ></div>
      <!-- Background Overlay Overlay for darkening image -->
      <div class="absolute inset-0 z-0" style="background-color: rgba(30, 130, 76, 0.7);"></div>
      
      <div class="relative z-10 max-w-4xl flex flex-col items-center mt-4 md:mt-8">
        <span class="font-dm-mono text-xs sm:text-sm tracking-widest text-[#d1f2d6] uppercase border border-[#8ce397] rounded-full px-3 py-1 mb-6 bg-white/10 backdrop-blur-sm shadow-sm">
          ● AI-POWERED HEALTHCARE TECHNOLOGY
        </span>
        <h2 class="font-caprasimo font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight" style="text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);">
          Hospital Meal Planner <br class="hidden sm:inline"/> & <br class="hidden sm:inline"/> Inventory Management System
        </h2>
        <p class="font-dm-serif text-base sm:text-xl md:text-2xl text-[#d1f2d6] mb-2" style="text-shadow: 1px 1px 4px rgba(0,0,0,0.6);">
          Misamis Oriental Provincial Hospital — Manticao
        </p>
        <p class="font-dm-serif italic text-sm sm:text-lg md:text-xl text-[#fbbf24] mb-8 md:mb-10" style="text-shadow: 1px 1px 4px rgba(0,0,0,0.6);">
          “Pag MOPH - Manticao ko, secure ka!”
        </p>
        
        <button 
          @click="goToRoleSelection"
          class="font-candal bg-[#1b4332] hover:bg-[#2d5f3f] text-white px-12 py-4 sm:px-20 sm:py-5 rounded-full text-lg sm:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 tracking-wider uppercase"
        >
          LOGIN
        </button>
      </div>

      <!-- Bottom Right Hospital Seal -->
      <div class="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-10">
        <img src="@/assets/hospital-seal.png" alt="Hospital Seal" class="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 drop-shadow-2xl opacity-90" />
      </div>
    </section>

    <!-- Section C: Core Features Section -->
    <section id="features" class="py-20 px-6 bg-[#f4faf7] flex flex-col items-center">
      <div class="max-w-6xl w-full flex flex-col items-center">
        <span class="font-dm-mono text-[#2D5F3F] text-sm font-bold tracking-widest uppercase mb-2 block">CORE FEATURES</span>
        <h2 class="font-caprasimo text-3xl md:text-5xl text-gray-900 mb-4 text-center">Built for Better Patient Care</h2>
        <p class="font-dm-sans text-gray-600 text-center max-w-2xl mb-12 text-base md:text-lg leading-relaxed">Integrated tools that help hospital dietitians, kitchen staff, and administrators deliver consistent, safe nutrition every day.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <!-- Card 1 -->
          <div class="group bg-white border border-[#d2edd7] rounded-2xl p-8 shadow-[0_8px_30px_rgba(45,95,63,0.06)] hover:shadow-[0_8px_30px_rgba(45,95,63,0.1)] transition-all duration-300 flex flex-col hover:-translate-y-1">
            <div class="mx-auto bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center text-hospital-green mb-6 transition-all duration-300 group-hover:bg-[#2D5F3F] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(45,95,63,0.5)]">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 22a7 7 0 0 1-7-7c0-2.5 1.5-4 3-5 .5-.5 1-1.5 1-2.5A3 3 0 0 1 12 4.5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 22a7 7 0 0 0 7-7c0-2.5-1.5-4-3-5-.5-.5-1-1.5-1-2.5A3 3 0 0 0 12 4.5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5V22" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 14.5a2.5 2.5 0 0 1 0-5M16 14.5a2.5 2.5 0 0 0 0-5" />
              </svg>
            </div>
            <h3 class="font-candal text-xl text-gray-900 mb-4 text-center">Intelligent Meal Planning</h3>
            <p class="font-dm-sans text-gray-600 mb-6 flex-grow leading-relaxed text-sm">
              Connects doctors and dietitians seamlessly. Doctors set dietary prescriptions, while dietitians easily assign daily menus utilizing meal calendars and an AI food exchange chatbot.
            </p>
            <ul class="font-dm-mono text-xs text-gray-500 space-y-2 border-t border-gray-100 pt-6">
              <li><span class="text-[#2D5F3F] font-bold">→</span> Doctor prescription tracking</li>
              <li><span class="text-[#2D5F3F] font-bold">→</span> AI food exchange chatbot</li>
              <li><span class="text-[#2D5F3F] font-bold">→</span> Automated meal calendars</li>
            </ul>
          </div>
          
          <!-- Card 2 -->
          <div class="group bg-white border border-[#d2edd7] rounded-2xl p-8 shadow-[0_8px_30px_rgba(45,95,63,0.06)] hover:shadow-[0_8px_30px_rgba(45,95,63,0.1)] transition-all duration-300 flex flex-col hover:-translate-y-1">
            <div class="mx-auto bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center text-hospital-green mb-6 transition-all duration-300 group-hover:bg-[#2D5F3F] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(45,95,63,0.5)]">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 class="font-candal text-xl text-gray-900 mb-4 text-center">Integrated Inventory & Kitchen</h3>
            <p class="font-dm-sans text-gray-600 mb-6 flex-grow leading-relaxed text-sm">
              Empowers purchasing officers and kitchen staff with smart management tools to monitor ingredient stocks, log movements, and follow daily food production schedules.
            </p>
            <ul class="font-dm-mono text-xs text-gray-500 space-y-2 border-t border-gray-100 pt-6">
              <li><span class="text-[#2D5F3F] font-bold">→</span> Smart low-stock buy lists</li>
              <li><span class="text-[#2D5F3F] font-bold">→</span> Stock movement tracking</li>
              <li><span class="text-[#2D5F3F] font-bold">→</span> Daily kitchen schedules</li>
            </ul>
          </div>
          
          <!-- Card 3 -->
          <div class="group bg-white border border-[#d2edd7] rounded-2xl p-8 shadow-[0_8px_30px_rgba(45,95,63,0.06)] hover:shadow-[0_8px_30px_rgba(45,95,63,0.1)] transition-all duration-300 flex flex-col hover:-translate-y-1">
            <div class="mx-auto bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center text-hospital-green mb-6 transition-all duration-300 group-hover:bg-[#2D5F3F] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(45,95,63,0.5)]">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="font-candal text-xl text-gray-900 mb-4 text-center">Secure Meal Distribution</h3>
            <p class="font-dm-sans text-gray-600 mb-6 flex-grow leading-relaxed text-sm">
              Ensures every patient receives the correct, safe meal. Combines automated dietary safety checks with mobile QR code scanning for highly accurate ward deliveries.
            </p>
            <ul class="font-dm-mono text-xs text-gray-500 space-y-2 border-t border-gray-100 pt-6">
              <li><span class="text-[#2D5F3F] font-bold">→</span> Automated safety validation</li>
              <li><span class="text-[#2D5F3F] font-bold">→</span> QR code ward scanning</li>
              <li><span class="text-[#2D5F3F] font-bold">→</span> Real-time service history</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Section D: Trust Band (Mid-page Metrics) -->
    <section class="bg-[#2D5F3F] py-12 md:py-16 px-6">
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <!-- Left Heading -->
        <div class="text-center lg:text-left">
          <span class="font-dm-mono text-green-200 text-xs tracking-widest uppercase mb-3 block">DEPARTMENT OF HEALTH COMPLIANT</span>
          <h2 class="font-dm-serif text-2xl sm:text-3xl md:text-4xl text-white leading-tight">Aligned with Philippine Hospital Dietary Standards</h2>
        </div>
        <!-- Right Stats -->
        <div class="grid grid-cols-3 text-center">
          <div class="border-r border-green-600/40 px-2">
            <div class="font-dm-serif text-2xl sm:text-3xl md:text-4xl text-white mb-2">100%</div>
            <div class="font-dm-mono text-[9px] sm:text-xs text-green-100 uppercase tracking-wide">DOH-aligned menus</div>
          </div>
          <div class="border-r border-green-600/40 px-2">
            <div class="font-dm-serif text-2xl sm:text-3xl md:text-4xl text-white mb-2">24/7</div>
            <div class="font-dm-mono text-[9px] sm:text-xs text-green-100 uppercase tracking-wide">Real-time monitoring</div>
          </div>
          <div class="px-2">
            <div class="font-dm-serif text-2xl sm:text-3xl md:text-4xl text-white mb-2">0</div>
            <div class="font-dm-mono text-[9px] sm:text-xs text-green-100 uppercase tracking-wide">Missed dietary flags</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section E: Footer -->
    <footer id="contact" class="bg-[#15261d] text-white py-8 px-6 md:px-12 border-t border-green-900/30">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <!-- Brand -->
        <div class="flex flex-col items-start">
          <div class="flex items-center gap-2.5 mb-3">
            <img src="@/assets/hospital-seal.png" alt="MOPH Logo" class="h-10 w-10 opacity-90" />
            <div>
              <h3 class="font-dm-serif text-lg text-white font-bold leading-none mb-1">MOPH - Manticao</h3>
              <p class="font-dm-sans text-gray-500 text-xs">Est. 1988</p>
            </div>
          </div>
          <p class="font-dm-sans text-gray-400 mb-3 leading-relaxed max-w-sm text-sm">
            Misamis Oriental Provincial Hospital — Manticao.<br/>
            Committed to delivering compassionate, quality healthcare to every patient we serve.
          </p>
          <p class="font-dm-serif italic text-[#a5d6a7] text-sm">“Pag MOPH - Manticao ko, secure ka!”</p>
        </div>
        
        <!-- Contact -->
        <div class="md:ml-auto md:mr-24 lg:mr-36">
          <h4 class="font-dm-mono text-[#a5d6a7] text-xs font-semibold tracking-widest mb-4">CONTACT</h4>
          <ul class="font-dm-sans text-gray-400 space-y-2 text-sm">
            <li class="flex items-start gap-2.5">
              <svg class="w-4 h-4 text-[#a5d6a7] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <a href="https://www.google.com/maps/search/?api=1&query=Misamis+Oriental+Provincial+Hospital+Manticao" target="_blank" rel="noopener noreferrer" class="hover:text-white hover:underline transition-colors">9024, Poblacion, Manticao,<br/>Misamis Oriental</a>
            </li>
            <li class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#a5d6a7] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <a href="tel:09350267612" class="hover:text-white hover:underline transition-colors">0935 026 7612</a>
            </li>
            <li class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#a5d6a7] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <a href="mailto:manticaomisorph@gmail.com" class="hover:text-white hover:underline transition-colors">manticaomisorph@gmail.com</a>
            </li>
            <li class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#a5d6a7] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
              <a href="https://www.facebook.com/misorphmanticaoofficialpage/" target="_blank" rel="noopener noreferrer" class="hover:text-white hover:underline transition-colors">MOPH Manticao Official Page</a>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Copyright Bar -->
      <div class="border-t border-gray-800/40 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <p class="font-dm-mono text-xs text-gray-500">© 2026 Misamis Oriental Provincial Hospital - Manticao. All rights reserved.</p>
        <p class="font-dm-mono text-xs text-gray-500">Republic of the Philippines · Department of Health</p>
      </div>
    </footer>

    <!-- About Modal Overlay -->
    <div v-if="isAboutOpen" class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <!-- Modal Content Card -->
      <div class="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col p-6 md:p-8 shadow-2xl relative border border-green-50 animate-in fade-in zoom-in-95 duration-200">
        <!-- Close Button top right -->
        <button @click="isAboutOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10" aria-label="Close modal">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header (Static) -->
        <div class="flex items-start gap-4 mb-5 shrink-0">
          <img src="@/assets/hospital-seal.png" alt="MOPH Logo" class="w-12 h-12 md:w-14 md:h-14 shrink-0" />
          <div>
            <h3 class="font-dm-serif text-xl md:text-2xl text-gray-900 leading-tight">About the System</h3>
            <p class="font-dm-mono text-[9px] md:text-[10px] text-gray-500 mt-1">MOPH Manticao – Hospital Meal Planner & Inventory Management System</p>
          </div>
        </div>

        <!-- Body (Scrollable) -->
        <div class="flex-1 overflow-y-auto pr-2.5 space-y-4 font-dm-sans text-gray-600 text-xs md:text-sm leading-relaxed mb-5 scrollbar-thin">
          <p>
            The <strong class="font-bold text-gray-800">MOPH Manticao Hospital Meal Planner and Inventory Management System</strong> is a digital tool made specially for the Misamis Oriental Provincial Hospital in Manticao. It was built specifically for the hospital's Dietary Department to digitize and automate how they manage patient meals.
          </p>
          <p>
            This system connects everyone involved in feeding patients — from the doctor who orders the diet to the food server who delivers it. It uses a smart Rule-Based Expert System to make sure every meal is safe from allergies, matches the doctor's orders, and stays within the hospital's daily budget. With real-time inventory tracking and QR-code scanning for deliveries, the system prevents mistakes, reduces food waste, and ensures patients get the exact nutrition they need to recover.
          </p>
          <p>
            Built to follow Department of Health (DOH) standards, this secure platform is designed only for authorized hospital staff, including <strong class="font-bold text-gray-800">Admins, Doctors, Dietitians, Purchasing Officers, Kitchen Staff, and Food Servers</strong>.
          </p>
        </div>

        <!-- Footer / Close button (Static) -->
        <div class="border-t border-gray-100 pt-4 flex justify-end shrink-0">
          <button @click="isAboutOpen = false" class="font-dm-sans bg-[#2D5F3F] hover:bg-[#1e4029] text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import hospitalBg from '@/assets/hospital-building.jpg';

const router = useRouter();
const isMenuOpen = ref(false);
const isAboutOpen = ref(false);

function goToRoleSelection() {
  router.push('/select-role');
}
</script>

<style scoped>
/* Scoped styles are minimal since we are primarily using Tailwind classes. */
</style>
