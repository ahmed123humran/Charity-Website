import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  await prisma.snippet.deleteMany({}); // Clear existing snippets

  const snippets = [
    {
      name: 'Modern Hero',
      category: 'Intro',
      htmlContent: `
  <section class="relative py-20 lg:py-32 overflow-hidden bg-white dark:bg-slate-900 transition-colors">
    <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
    <div class="container mx-auto px-4 relative z-10 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in-up">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        New Features Available
      </div>
      <h1 class="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
        Transform Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-accent">Digital Presence</span>
      </h1>
      <p class="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
        Create stunning websites with our intuitive builder. Powerful, flexible, and designed for modern needs.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <a href="#" class="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
          Get Started
        </a>
        <a href="#" class="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
          Learn More
        </a>
      </div>
    </div>
  </section>
      `
    },
    {
      name: 'Hero - Figma Style',
      category: 'Intro',
      htmlContent: `
<section class="relative py-20 lg:py-28 bg-white dark:bg-slate-900 overflow-hidden">
  <!-- Background decoration -->
  <div class="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
  <div class="absolute bottom-0 left-0 translate-y-12 -translate-x-1/3 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl"></div>

  <div class="container mx-auto px-4 relative z-10">
    <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      
      <!-- Left Content -->
      <div class="lg:w-1/2 text-center lg:text-start animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm mb-8">
          <span class="flex h-3 w-3 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">Urgent: Winter Relief Fund</span>
        </div>

        <h1 class="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
          Help us <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-accent">save lives</span> today.
        </h1>
        
        <p class="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
          Your contribution provides immediate aid to those in crisis. Join our community of changemakers and make a tangible impact.
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
          <a href="#" class="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark hover:-translate-y-1 transition-all shadow-lg shadow-primary/25">
            Donate Now
          </a>
          <a href="#" class="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-1 transition-all">
            Watch Video
          </a>
        </div>

        <!-- Social Proof -->
        <div class="pt-8 border-t border-slate-100 dark:border-slate-800">
          <p class="text-sm text-slate-500 mb-4 font-medium">Trusted by partners worldwide</p>
          <div class="flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <!-- Placeholder Logos -->
             <div class="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
             <div class="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
             <div class="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          </div>
        </div>
      </div>

      <!-- Right Image -->
      <div class="lg:w-1/2 relative">
        <div class="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
            alt="Happy children" 
            class="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
          >
          <!-- Floating Card -->
          <div class="absolute bottom-8 left-8 right-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 animate-fade-in-up" style="animation-delay: 500ms;">
            <div class="flex items-center justify-between mb-4">
               <div>
                 <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Raised</p>
                 <p class="text-2xl font-bold text-slate-900 dark:text-white">$1,240,500</p>
               </div>
               <div class="p-3 bg-green-100 text-green-600 rounded-xl">
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
               </div>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2">
              <div class="bg-primary h-2 rounded-full" style="width: 85%"></div>
            </div>
            <p class="text-xs text-slate-500 text-end">85% of goal reached</p>
          </div>
        </div>

        <!-- Floating Badge Top Right -->
        <div class="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl animate-bounce-slow border border-slate-100 dark:border-slate-700 hidden lg:block">
           <div class="flex items-center gap-3">
             <div class="flex -space-x-3">
               <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="User">
               <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" alt="User">
               <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="User">
             </div>
             <div class="text-sm font-bold text-slate-900 dark:text-white">
               +2k <br> <span class="text-slate-500 font-normal text-xs">Joined today</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      name: 'Features Grid',
      category: 'Features',
      htmlContent: `
<section class="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">Everything You Need</h2>
      <p class="text-slate-600 dark:text-slate-400">Powerful features to help you build, manage, and scale your website.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Feature 1 -->
      <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
          <svg class="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Lightning Fast</h3>
        <p class="text-slate-500 dark:text-slate-400 leading-relaxed">Optimized for speed and performance to ensure your site loads instantly.</p>
      </div>
      <!-- Feature 2 -->
      <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
          <svg class="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Fully Customizable</h3>
        <p class="text-slate-500 dark:text-slate-400 leading-relaxed">Easy to use drag-and-drop builder to create exactly the look you want.</p>
      </div>
      <!-- Feature 3 -->
      <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
          <svg class="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Secure by Design</h3>
        <p class="text-slate-500 dark:text-slate-400 leading-relaxed">Enterprise-grade security features built-in to protect your data.</p>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      name: 'Content Image Left',
      category: 'Content',
      htmlContent: `
<section class="py-20 bg-white dark:bg-slate-900 transition-colors">
  <div class="container mx-auto px-4">
    <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      <div class="lg:w-1/2 relative group">
        <div class="absolute -inset-4 bg-gradient-to-r from-primary to-primary-accent rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
        <img 
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" 
          alt="Team collaboration" 
          class="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-500"
        >
      </div>
      <div class="lg:w-1/2">
        <div class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">Our Story</div>
        <h2 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
          Building the future of <br>
          <span class="text-primary">Digital Philanthropy</span>
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          We believe in the power of technology to amplify human kindness. Our platform isn't just a tool; it's a bridge between donors and the causes they care about.
        </p>
        <ul class="space-y-4 mb-8">
          <li class="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            Transparent reporting and analytics
          </li>
          <li class="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            Instant global payments
          </li>
          <li class="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            Community-driven governance
          </li>
        </ul>
        <a href="#" class="text-primary font-semibold hover:text-primary-dark inline-flex items-center gap-1 group">
          Read more about us 
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      name: 'Stats Row',
      category: 'Content',
      htmlContent: `
<section class="py-16 bg-slate-900 text-white border-t border-slate-800">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
      <div class="p-4 group cursor-default">
        <div class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2 group-hover:to-primary transition-all">10k+</div>
        <div class="text-slate-400 font-medium group-hover:text-white transition-colors">Active Donors</div>
      </div>
      <div class="p-4 group cursor-default">
        <div class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2 group-hover:to-primary transition-all">$2M</div>
        <div class="text-slate-400 font-medium group-hover:text-white transition-colors">Raised Total</div>
      </div>
      <div class="p-4 group cursor-default">
        <div class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2 group-hover:to-primary transition-all">500+</div>
        <div class="text-slate-400 font-medium group-hover:text-white transition-colors">Projects Funded</div>
      </div>
      <div class="p-4 group cursor-default">
        <div class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2 group-hover:to-primary transition-all">50+</div>
        <div class="text-slate-400 font-medium group-hover:text-white transition-colors">Countries Reached</div>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      name: 'Donation Campaign',
      category: 'Features',
      htmlContent: `
<section class="py-20 bg-white dark:bg-slate-900">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <span class="text-primary font-bold tracking-wider uppercase text-sm">Urgent Causes</span>
      <h2 class="text-3xl lg:text-4xl font-bold mt-2 text-slate-900 dark:text-white">Featured Campaigns</h2>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Card 1 -->
      <div class="rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:-translate-y-2 transition-transform duration-300">
        <div class="relative h-48 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800" alt="Clean Water" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900">Environment</div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">Clean Water Initiative</h3>
          <p class="text-slate-500 text-sm mb-6 line-clamp-2">Providing clean and safe drinking water to remote villages in need.</p>
          
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1 font-medium">
              <span class="text-primary">75% Raised</span>
              <span class="text-slate-500">$7,500 / $10,000</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div class="bg-primary h-2.5 rounded-full" style="width: 75%"></div>
            </div>
          </div>
          
          <button class="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors">
            Donate Now
          </button>
        </div>
      </div>
      
      <!-- Card 2 -->
      <div class="rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:-translate-y-2 transition-transform duration-300">
        <div class="relative h-48 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" alt="Education" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900">Education</div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">Education for All</h3>
          <p class="text-slate-500 text-sm mb-6 line-clamp-2">Building schools and supplying books for children in underprivileged areas.</p>
          
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1 font-medium">
              <span class="text-primary">45% Raised</span>
              <span class="text-slate-500">$22,500 / $50,000</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div class="bg-primary h-2.5 rounded-full" style="width: 45%"></div>
            </div>
          </div>
          
          <button class="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors">
            Donate Now
          </button>
        </div>
      </div>

       <!-- Card 3 -->
      <div class="rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:-translate-y-2 transition-transform duration-300">
        <div class="relative h-48 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800" alt="Medical" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900">Medical</div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">Emergency Relief</h3>
          <p class="text-slate-500 text-sm mb-6 line-clamp-2">Providing essential medical supplies and emergency care to disaster zones.</p>
          
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1 font-medium">
              <span class="text-primary">90% Raised</span>
              <span class="text-slate-500">$90,000 / $100,000</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div class="bg-primary h-2.5 rounded-full" style="width: 90%"></div>
            </div>
          </div>
          
          <button class="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors">
            Donate Now
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      name: 'Call to Action',
      category: 'CTA',
      htmlContent: `
<section class="py-20">
  <div class="container mx-auto px-4">
    <div class="bg-primary rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
      <!-- Decorative circles -->
      <div class="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-black opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div class="relative z-10 max-w-3xl mx-auto">
        <h2 class="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to make a difference?</h2>
        <p class="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of other organizations that are already using our platform to change the world.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" class="px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg hover:scale-105 active:scale-95">
            Start Free Trial
          </a>
          <a href="#" class="px-8 py-4 bg-primary-dark/30 text-white border border-white/20 rounded-xl font-bold hover:bg-primary-dark/50 transition-colors backdrop-blur-sm">
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      name: 'Testimonials',
      category: 'Content',
      htmlContent: `
<section class="py-20 bg-slate-50 dark:bg-slate-950">
  <div class="container mx-auto px-4">
     <div class="text-center mb-16">
      <h2 class="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">Voices of Impact</h2>
      <p class="text-slate-500 mt-2">Hear from the people we've helped and partnered with.</p>
    </div>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
        <svg class="text-primary/20 w-16 h-16 absolute top-6 left-6 -z-0" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V4C14.017 3.44772 14.4647 3 15.017 3H19.017C20.6739 3 22.017 4.34315 22.017 6V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01691 21L5.01691 18C5.01691 16.8954 5.91234 16 7.01691 16H10.0169C10.5692 16 11.0169 15.5523 11.0169 15V9C11.0169 8.44772 10.5692 8 10.0169 8H6.01691C5.46462 8 5.01691 7.55228 5.01691 7V4C5.01691 3.44772 5.46462 3 6.01691 3H10.0169C11.6738 3 13.0169 4.34315 13.0169 6V15C13.0169 18.3137 10.3306 21 7.01691 21H5.01691Z" /></svg>
        <div class="relative z-10">
          <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">"This platform has completely transformed how we manage our donations. The transparency and ease of use have increased our funding by 40% in just six months."</p>
          <div class="flex items-center gap-4">
             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Sarah J." class="w-12 h-12 rounded-full object-cover">
             <div>
               <div class="font-bold text-slate-900 dark:text-white">Sarah Jenkins</div>
               <div class="text-sm text-primary font-medium">Director, EcoSave</div>
             </div>
          </div>
        </div>
      </div>
      
       <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
        <svg class="text-primary/20 w-16 h-16 absolute top-6 left-6 -z-0" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V4C14.017 3.44772 14.4647 3 15.017 3H19.017C20.6739 3 22.017 4.34315 22.017 6V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01691 21L5.01691 18C5.01691 16.8954 5.91234 16 7.01691 16H10.0169C10.5692 16 11.0169 15.5523 11.0169 15V9C11.0169 8.44772 10.5692 8 10.0169 8H6.01691C5.46462 8 5.01691 7.55228 5.01691 7V4C5.01691 3.44772 5.46462 3 6.01691 3H10.0169C11.6738 3 13.0169 4.34315 13.0169 6V15C13.0169 18.3137 10.3306 21 7.01691 21H5.01691Z" /></svg>
        <div class="relative z-10">
          <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">"We reached our goal for the school building project much faster than anticipated. The community engagement features are simply outstanding."</p>
          <div class="flex items-center gap-4">
             <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" alt="Sarah J." class="w-12 h-12 rounded-full object-cover">
             <div>
               <div class="font-bold text-slate-900 dark:text-white">Michael Chen</div>
               <div class="text-sm text-primary font-medium">Coordinator, EduFirst</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      name: 'Contact Form - Detailed',
      category: 'Contact',
      htmlContent: `
<section class="py-20 bg-white dark:bg-slate-900">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl mx-auto bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div class="grid md:grid-cols-5 h-full">
        <!-- Contact Info / Decoration -->
        <div class="md:col-span-2 bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
          <div class="absolute inset-0 bg-primary/20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent"></div>
          <div class="relative z-10">
            <h3 class="text-2xl font-bold mb-4">Contact Us</h3>
            <p class="text-slate-300 text-sm mb-8">We'd love to hear from you. Fill out the form and we'll be in touch as soon as possible.</p>
            
            <div class="space-y-4">
              <div class="flex items-center gap-3 text-sm">
                <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <span>contact@example.com</span>
              </div>
            </div>
          </div>
          
          <div class="relative z-10 pt-10">
            <div class="flex gap-4">
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Form -->
        <div class="md:col-span-3 p-8 lg:p-10">
          <form class="space-y-5">
            <div class="grid md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Name</label>
                <input type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="John Doe">
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Company</label>
                <input type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Acme Inc.">
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input type="email" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="john@example.com">
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mobile</label>
                 <input type="tel" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="+1 (555) 000-0000">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message</label>
              <textarea rows="4" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="How can we help you?"></textarea>
            </div>
            
            <button type="submit" class="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
      `
    }
  ];

  for (const snippet of snippets) {
    await prisma.snippet.create({
      data: snippet,
    });
  }

  // Create or get default Website
  let website = await prisma.website.findFirst();
  if (!website) {
    website = await prisma.website.create({
      data: {
        name: { en: 'My Charity Website', ar: 'موقع جمعيتي' },
        domain: 'localhost',
        themeColor: '#4f46e5',
        language: 'en_US',
      }
    });
    console.log('Created default website');
  }

  // Create Default Home Page
  const homePage = await prisma.page.findUnique({
    where: { url: '/' }
  });

  if (!homePage) {
    // Fetch snippets to populate the home page
    const dbSnippets = await prisma.snippet.findMany();

    // Helper to find snippet by name
    const findSnip = (name: string) => dbSnippets.find(s => s.name === name);

    const hero = findSnip('Modern Hero');
    const features = findSnip('Features Grid');
    const stats = findSnip('Stats Row');
    const cta = findSnip('Call to Action');

    // Construct content array (simulating dropped snippets)
    const contentItems = [hero, stats, features, cta].filter(Boolean).map(s => ({
      id: crypto.randomUUID(), // unique instance ID
      snippetId: s!.id,
      htmlContent: s!.htmlContent,
      name: s!.name
    }));

    await prisma.page.create({
      data: {
        title: { en: 'Home', ar: 'الرئيسية' },
        url: '/',
        websiteId: website.id,
        isPublished: true,
        content: {
          en: contentItems,
          ar: contentItems // Use same content for now, or could duplicate/localize if snippets supported it
        }
      }
    });
    console.log('Created default Home page');
  } else {
    console.log('Home page already exists');
  }

  // Default Admin User
  const adminEmail = 'admin@ragmi.org';
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        password: 'admin123', // In a real app, hash this!
      }
    });
    console.log(`Created default admin user: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
