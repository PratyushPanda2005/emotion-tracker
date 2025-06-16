'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useLayoutEffect, useRef } from 'react'
import Ava_Logo from "../../public/assets/ava.svg"
import Hand from "../../public/assets/herosvgs/Select.svg"
import Select from "../../public/assets/herosvgs/check read.svg"
import gsap from 'gsap'
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);
const Home = () => {
   const avaLogo = useRef(null)
   useLayoutEffect(() => {
gsap.set(avaLogo.current, {
  transformOrigin: "50% 100%", 
  rotationZ: 45,
});

gsap.from(avaLogo.current, {
  rotationZ: -45, 
  repeat: -1,
  duration: 1.3,
  yoyo: true,
  ease: "sine.inOut" 
});

let hasAnimated = false;
const splitTextInstances: SplitText[] = [];
const animationTweens: gsap.core.Tween[] = [];

const runAnimations = () => {
  if (hasAnimated) return;
  hasAnimated = true;

  const createSplitAnimation = (selector: string) => {
    const split = SplitText.create(selector, {
      type: "words,lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines"
    });
    
    splitTextInstances.push(split);
    
    const tween = gsap.from(split.lines, {
      duration: 4,
      yPercent: 100,
      opacity: 0,
      stagger: 0.1,
      ease: "expo.out",
    });
    
    animationTweens.push(tween);
  };

  createSplitAnimation(".hero");
  createSplitAnimation(".hero-2");
  createSplitAnimation(".hero-3");
};

// Run animations after a brief delay to ensure DOM is ready
const timer = setTimeout(runAnimations, 50);

// Cleanup function
return () => {
  clearTimeout(timer);
  
  // Revert all SplitText instances
  splitTextInstances.forEach(instance => {
    if (instance.revert) instance.revert();
  });
  
  // Kill all active tweens
  animationTweens.forEach(tween => tween.kill());
};
   },[])
  return (
    <section className="min-h-screen relative flex flex-col justify-center items-center font-montserrat gap-4">
    <div className="max-w-5xl w-full flex justify-between">
      {/* <div>
    <Link href="/activity-page" className="text-[#C94A0D] flex gap-2"><span className="bg-white rounded-[100%]"><CircleArrowLeft/></span>Back</Link>
      </div> */}
      {/* <div>
    <Link href="/" className="flex gap-2 text-black">Skip<span className=""><CircleArrowRight color="black"/></span></Link>
      </div> */}
    </div>
    <div
      style={{
        backgroundImage: "url(/assets/Subtract.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="max-w-5xl p-20 max-sm:p-6 max-lg:p-10"
    >
      <div className="flex flex-col gap-10 text-center justify-center items-center ">
        <Image ref={avaLogo} src={Ava_Logo} alt="Completion logo" />
        <h1 className="text-3xl font-semibold text-[#005840] hero">
          Instructions
        </h1>
        <h2 className="text-black max-md:text-lg text-xl font-semibold hero-2">
        Welcome to the Stress scale. This is a quiz to identify our stress levels ranging from high to low and navigate through such situations.
        </h2>
        <div className='text-left flex flex-col gap-6 text-black'>
        <p className='font-semibold max-md:text-lg text-xl flex items-center leading-[120%]'><span><Image src={Hand} alt=''/></span>Read the statements carefully and relate to each of the statements.</p>
        <p className='font-semibold max-md:text-lg text-xl flex items-center leading-[120%]'><span><Image src={Select} alt=''/></span>Choose the option which best describes your mood.</p>
        </div>
       <Link href="/mood-selection" className='bg-[#005840] max-sm:w-full w-[50%] py-3 max-md:text-xl text-2xl font-semibold rounded-3xl'>Start Check In</Link>
      </div>
    </div>
  </section>
  )
}

export default Home