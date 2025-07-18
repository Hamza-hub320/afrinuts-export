import{j as e,m as t}from"./framer-CVwg68Rr.js";import{F as i,T as n,a as o}from"./main-JhHkz5Vq.js";import"./vendor-DTAUSwI4.js";import"./i18n-CNyPWq8H.js";const p=({newsItem:a,onClick:s,variants:r})=>e.jsxs(t.div,{className:"group relative bg-background rounded-2xl overflow-hidden",variants:r,whileHover:{y:-10,transition:{duration:.3}},initial:"hidden",whileInView:"visible",viewport:{once:!0},children:[e.jsx("div",{className:`
        absolute -inset-0.5 rounded-[15px]
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
        shadow-glow-accent-md
        z-0
      `}),e.jsx("div",{className:`
        absolute -inset-px rounded-[15px]
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        pointer-events-none
        border border-accent/30
        z-0
      `}),e.jsxs("div",{className:"relative z-10 h-full flex flex-col bg-background rounded-xl overflow-hidden",children:[e.jsx("div",{className:"h-64 bg-cover bg-center",style:{backgroundImage:`url(${a.image})`}}),e.jsxs("div",{className:"p-8",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx(i,{className:"text-accent"}),e.jsxs("span",{className:"text-accent text-sm font-medium",children:[a.category," • ",a.date]})]}),e.jsx(n,{variant:"h4",className:"mb-4",children:a.title}),e.jsx(n,{variant:"body",className:"mb-6",children:a.description}),e.jsxs("button",{className:"text-accent font-medium inline-flex items-center group",onClick:s,children:["Read more",e.jsx(o,{className:"ml-2 group-hover:translate-x-1 transition-transform"})]})]})]})]});export{p as NewsCard,p as default};
