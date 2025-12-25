import React from 'react'

const HalfView = ({title, icon, buttonlink, buttontext, children}) => {
  return (
    // Osiguravamo da roditelj zauzima punu visinu (h-full ili h-screen)
    <div className="h-full w-full flex flex-col  overflow-hidden" id="left">
      
      {/* Header: fiksne visine (zavisi od paddinga i sadržaja) */}
      <div id="header" className="w-full p-3 border-b border-[#cecece] flex flex-row items-center gap-2 shrink-0">
        {icon}
        <span className='text-black/60 text-xl font-semibold flex-1'>{title}</span>
        <a href={buttonlink}>
          <button className="btn btn-primary">{buttontext}</button>
        </a>
      </div>

      {/* Children: flex-1 uzima sav preostali prostor, overflow-y-auto omogućava skrolovanje */}
<div className="w-full flex-1 overflow-y-auto flex flex-wrap justify-items-center mt-6 justify-around">
        {children}
      </div>
      
    </div>
  )
}

export default HalfView