import React from 'react'

function Hero() {
  return (
    <section className="bg-black">
      <div className='flex items-baseline justify-center pt-10 md:pt-20 px-4'>
        <h2 className='text-white border px-2 py-1 md:px-3 md:p-2 rounded-full text-center border-white text-xs md:text-sm'>
          See What's New | <span className='text-sky-300'>Get quotes</span>
        </h2>
      </div>
      
      <div className="mx-auto min-h-[calc(100vh-64px)] max-w-screen-xl px-4 py-8 md:py-12 flex items-center justify-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl md:text-3xl lg:text-5xl text-sky-300 font-extrabold">
            Create & Customize
            <strong className="font-extrabold text-white block mt-1 md:mt-2"> 
              Electrical Panel Boards.
            </strong>
          </h1>

          <p className="mt-3 md:mt-4 text-base md:text-xl/relaxed text-slate-200 px-4 md:px-0">
            All-in-one markdown editor, collaborative canvas, and diagram-as-code builder
          </p>

          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
            <a
              className="block w-full rounded bg-white text-black px-8 md:px-12 py-2.5 md:py-3 text-sm font-medium shadow hover:bg-slate-200 focus:outline-none focus:ring active:bg-slate-300 sm:w-auto transition-colors duration-300"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
