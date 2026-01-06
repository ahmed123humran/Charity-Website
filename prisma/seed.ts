
import { PrismaClient } from '../app/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {

  await prisma.snippet.deleteMany({}); // Clear existing snippets

  const snippets = [
    {
      name: 'Modern Hero',
      category: 'Intro',
      htmlContent: `
<section class="relative py-20 lg:py-32 overflow-hidden bg-white">
  <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
  <div class="container mx-auto px-4 relative z-10 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
      </span>
      New Features Available
    </div>
    <h1 class="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
      Transform Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Digital Presence</span>
    </h1>
    <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
      Create stunning websites with our intuitive builder. Powerful, flexible, and designed for modern needs.
    </p>
    <div class="flex flex-col sm:flex-row justify-center gap-4">
      <a href="#" class="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
        Get Started
      </a>
      <a href="#" class="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
        Learn More
      </a>
    </div>
  </div>
</section>
      `
    },
    {
      name: 'Features Grid',
      category: 'Features',
      htmlContent: `
<section class="py-20 bg-slate-50">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-3xl font-bold text-slate-900 mb-4">Everything You Need</h2>
      <p class="text-slate-600">Powerful features to help you build, manage, and scale your website.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Feature 1 -->
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
          <svg class="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
        <p class="text-slate-500 leading-relaxed">Optimized for speed and performance to ensure your site loads instantly.</p>
      </div>
      <!-- Feature 2 -->
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
          <svg class="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3">Fully Customizable</h3>
        <p class="text-slate-500 leading-relaxed">Easy to use drag-and-drop builder to create exactly the look you want.</p>
      </div>
      <!-- Feature 3 -->
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
          <svg class="w-7 h-7 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3">Secure by Design</h3>
        <p class="text-slate-500 leading-relaxed">Enterprise-grade security features built-in to protect your data.</p>
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
<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      <div class="lg:w-1/2 relative">
        <div class="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] opacity-20 blur-2xl"></div>
        <img 
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" 
          alt="Team collaboration" 
          class="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-500"
        >
      </div>
      <div class="lg:w-1/2">
        <div class="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-4">Our Story</div>
        <h2 class="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
          Building the future of <br>
          <span class="text-indigo-600">Digital Philanthropy</span>
        </h2>
        <p class="text-lg text-slate-600 mb-6 leading-relaxed">
          We believe in the power of technology to amplify human kindness. Our platform isn't just a tool; it's a bridge between donors and the causes they care about.
        </p>
        <ul class="space-y-4 mb-8">
          <li class="flex items-center gap-3 text-slate-700">
            <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Transparent reporting and analytics
          </li>
          <li class="flex items-center gap-3 text-slate-700">
            <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Instant global payments
          </li>
          <li class="flex items-center gap-3 text-slate-700">
            <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Community-driven governance
          </li>
        </ul>
        <a href="#" class="text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center gap-1 group">
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
<section class="py-16 bg-slate-900 text-white">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
      <div class="p-4">
        <div class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2">10k+</div>
        <div class="text-slate-400 font-medium">Active Donors</div>
      </div>
      <div class="p-4">
        <div class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2">$2M</div>
        <div class="text-slate-400 font-medium">Raised Total</div>
      </div>
      <div class="p-4">
        <div class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2">500+</div>
        <div class="text-slate-400 font-medium">Projects Funded</div>
      </div>
      <div class="p-4">
        <div class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2">50+</div>
        <div class="text-slate-400 font-medium">Countries Reached</div>
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
    <div class="bg-indigo-600 rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
      <!-- Decorative circles -->
      <div class="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-purple-500 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div class="relative z-10 max-w-3xl mx-auto">
        <h2 class="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to start your journey?</h2>
        <p class="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of other organizations that are already using our platform to make a difference in the world.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" class="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
            Start Free Trial
          </a>
          <a href="#" class="px-8 py-4 bg-indigo-700 text-white border border-indigo-500 rounded-xl font-bold hover:bg-indigo-800 transition-colors">
            Contact Sales
          </a>
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
