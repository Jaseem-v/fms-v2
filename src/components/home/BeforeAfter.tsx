import React from 'react'

export default function BeforeAfter() {
    return (
        <section className="py-16 bg-green-50 pb-0">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center md:mb-12 mb-6">
                    <h2 className="section-header__title instrument-sans before-after-title">
                        Meet <span>Felix</span>
                    </h2>

                    <p className='section-header__description before-after-description'>
                        Before using <span className='font-bold'>FixMyStore</span>.com

                    </p>
                </div>

                <div className='flex justify-center'>
                    <img src="/jacob-before-desktop.png" alt="" className='hidden md:block' />
                    <img src="/jacob-before.png" alt="" className='block md:hidden' />
                </div>
            </div>

            <div className="container mx-auto max-w-4xl mt-16 ">
                <div className="text-center md:mb-12 mb-6">
                    <h2 className="section-header__title instrument-sans before-after-title">
                        Now    Meet <span>Felix</span>
                    </h2>

                    <p className='section-header__description before-after-description'>
                        After using <span className='font-bold'>FixMyStore</span>.com
                    </p>
                </div>

                <div className='flex justify-center'>
                    <img src="/jacob-after-desktop.png" alt="" className='hidden md:block' />
                    <img src="/jacob-after.png" alt="" className='block md:hidden' />
                </div>
            </div>
        </section>
    )
}
