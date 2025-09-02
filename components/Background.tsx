
import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0c0a1a] via-[#1a1a3a] to-[#3a2a5a] overflow-hidden">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <style>{`
        @keyframes shoot {
            0% {
                transform: translateX(0) translateY(0) rotate(-45deg);
                opacity: 1;
            }
            100% {
                transform: translateX(-100vw) translateY(100vh) rotate(-45deg);
                opacity: 0;
            }
        }
        .shooting-star {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2px;
            height: 120px;
            background: linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4));
            border-radius: 999px;
            transform: rotate(-45deg);
            animation: shoot 10s ease-in-out infinite;
            opacity: 0;
        }
        .shooting-star:nth-child(1) {
            top: 10%;
            left: 90%;
            animation-delay: 0s;
            animation-duration: 7s;
        }
        .shooting-star:nth-child(2) {
            top: 30%;
            left: 60%;
            animation-delay: 2s;
            animation-duration: 8s;
        }
        .shooting-star:nth-child(3) {
            top: -20%;
            left: 40%;
            animation-delay: 4.5s;
            animation-duration: 6s;
        }
        .shooting-star:nth-child(4) {
            top: 50%;
            left: 110%;
            animation-delay: 6s;
            animation-duration: 9s;
        }
        .shooting-star:nth-child(5) {
            top: 80%;
            left: 80%;
            animation-delay: 8.2s;
            animation-duration: 7.5s;
        }
        `}</style>
    </div>
  );
};

export default Background;
