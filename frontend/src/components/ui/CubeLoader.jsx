import React from 'react';

const CubeLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 min-h-[220px] bg-transparent perspective-container">
      <div className="relative w-20 h-20 flex items-center justify-center preserve-3d">
        <div className="relative w-full h-full preserve-3d animate-cube-spin">
          <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-[#C5A028] blur-md shadow-[0_0_32px_rgba(197,160,40,0.85)] animate-pulse-fast" />

          <div className="side-wrapper front">
            <div className="face bg-[rgba(197,160,40,0.08)] border-2 border-[rgba(197,160,40,0.9)] shadow-[0_0_16px_rgba(197,160,40,0.55)]" />
          </div>

          <div className="side-wrapper back">
            <div className="face bg-[rgba(197,160,40,0.08)] border-2 border-[rgba(197,160,40,0.9)] shadow-[0_0_16px_rgba(197,160,40,0.55)]" />
          </div>

          <div className="side-wrapper right">
            <div className="face bg-[rgba(34,34,34,0.06)] border-2 border-[rgba(34,34,34,0.85)] shadow-[0_0_16px_rgba(34,34,34,0.5)]" />
          </div>

          <div className="side-wrapper left">
            <div className="face bg-[rgba(34,34,34,0.06)] border-2 border-[rgba(34,34,34,0.85)] shadow-[0_0_16px_rgba(34,34,34,0.5)]" />
          </div>

          <div className="side-wrapper top">
            <div className="face bg-[rgba(247,245,240,0.4)] border-2 border-[rgba(197,160,40,0.6)] shadow-[0_0_18px_rgba(247,245,240,0.9)]" />
          </div>

          <div className="side-wrapper bottom">
            <div className="face bg-[rgba(247,245,240,0.2)] border-2 border-[rgba(197,160,40,0.5)] shadow-[0_0_14px_rgba(34,34,34,0.45)]" />
          </div>
        </div>

        <div className="absolute -bottom-14 w-20 h-7 bg-[rgba(0,0,0,0.15)] blur-xl rounded-[100%] animate-shadow-breathe" />
      </div>

      <div className="flex flex-col items-center gap-1 mt-2">
        <h3 className="text-xs md:text-sm font-semibold tracking-[0.28em] text-[#C5A028] uppercase">
          Loading
        </h3>
        <p className="text-[11px] md:text-xs text-stone-500">
          Calibrating research pathways. Just a moment…
        </p>
      </div>

      <style>{`
        .perspective-container {
          perspective: 1200px;
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        @keyframes cubeSpin {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        @keyframes breathe {
          0%, 100% { transform: translateZ(40px); opacity: 0.9; }
          50% { transform: translateZ(70px); opacity: 0.5; }
        }

        @keyframes pulse-fast {
          0%, 100% { transform: scale(0.85); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        @keyframes shadow-breathe {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.5); opacity: 0.15; }
        }

        .animate-cube-spin {
          animation: cubeSpin 9s linear infinite;
        }

        .animate-pulse-fast {
          animation: pulse-fast 2.2s ease-in-out infinite;
        }

        .animate-shadow-breathe {
          animation: shadow-breathe 3s ease-in-out infinite;
        }

        .side-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        .face {
          width: 100%;
          height: 100%;
          position: absolute;
          animation: breathe 3s ease-in-out infinite;
          backdrop-filter: blur(3px);
        }

        .front  { transform: rotateY(0deg); }
        .back   { transform: rotateY(180deg); }
        .right  { transform: rotateY(90deg); }
        .left   { transform: rotateY(-90deg); }
        .top    { transform: rotateX(90deg); }
        .bottom { transform: rotateX(-90deg); }
      `}</style>
    </div>
  );
};

export default CubeLoader;

