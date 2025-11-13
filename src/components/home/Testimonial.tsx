'use client';

import React from 'react';

interface TestimonialData {
    id: number;
    text: string;
    name: string;
    location: string;
    avatar?: string;
}

const testimonials: TestimonialData[] = [
    {
        id: 1,
        text: 'Analyzed everything and helped remove unnecessary apps, making the store much smoother now.',
        name: 'Charlie Suede',
        location: 'United States',
        avatar: '/testimonials/1.png'
    },
    {
        id: 2,
        text: 'Analyzed everything and helped remove unnecessary apps, making the store much smoother now.',
        name: 'Purifit',
        location: 'India',
        avatar: '/testimonials/2.png'
    },
    {
        id: 3,
        text: 'Analyzed everything and helped remove unnecessary apps, making the store much smoother now.',
        name: 'Charlie Suede',
        location: 'United States',
        avatar: '/testimonials/3.png'
    }
];

const StarRating = () => {
    return (
        <div className="testimonials__stars">
            {[...Array(5)].map((_, index) => (
                <svg
                    key={index}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z"
                        fill="#FFD700"
                    />
                </svg>
            ))}
        </div>
    );
};

export default function Testimonial() {
    return (
        <section className="testimonials">
            <div className="testimonials__container">
                {/* <h2 className="__title">What our users say</h2> */}

                <div className="text-center mb-4 flex flex-col gap-4 why-fix-section__header">
                    <h2 className="section-header__title">
                        What our users say
                    </h2>
                </div>

                <div className="testimonials__grid">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="testimonials__card">
                            <StarRating />
                            <p className="testimonials__text">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>
                            <div className="testimonials__author">
                                <div className="testimonials__avatar">
                                    {testimonial.avatar ? (
                                        <img src={testimonial.avatar} alt={testimonial.name} />
                                    ) : (
                                        <span className="testimonials__avatar-placeholder">
                                            {testimonial.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div className="testimonials__author-info">
                                    <h4 className="testimonials__author-name">{testimonial.name}</h4>
                                    <p className="testimonials__author-location">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
