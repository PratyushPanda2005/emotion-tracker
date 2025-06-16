'use client'
import React, { useLayoutEffect, useState } from 'react';
import Angry_Face from '../../../public/assets/faces/Face (6).svg';
import Sad_Face from '../../../public/assets/faces/Face (1).svg';
import Neutral_Face from '../../../public/assets/faces/Face (2).svg';
import Content_Face from '../../../public/assets/faces/Face (3).svg';
import Happy_Face from '../../../public/assets/faces/Face (4).svg';
import Awe_Face from '../../../public/assets/faces/Face (5).svg';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from "gsap";  
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

type Mood = {
  id: number;
  name: string;
  icon: StaticImageData;
};

const MoodSelection = () => {
  const router = useRouter();
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const moods: Mood[] = [
    { id: 1, name: 'Angry', icon: Angry_Face },
    { id: 2, name: 'Sad', icon: Sad_Face },
    { id: 3, name: 'Neutral', icon: Neutral_Face },
    { id: 4, name: 'Content', icon: Content_Face },
    { id: 5, name: 'Happy', icon: Happy_Face },
    { id: 6, name: 'Awe', icon: Awe_Face },
  ];

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMoods(prev => {
      if (prev.some(m => m.id === mood.id)) {
        return prev.filter(m => m.id !== mood.id);
      }
      return [...prev, mood];
    });
  };

  const handleSubmit = async () => {
    if (selectedMoods.length === 0) return;
  
    setIsLoading(true);
    
    try {
      // Your API call here (if needed)
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          moods: selectedMoods,
          timestamp: new Date().toISOString(),
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
  
      await response.json();
  
      // Navigate to emotion-rate first with all moods and starting index
      router.push(`/emotion-rate?currentIndex=0&moods=${encodeURIComponent(JSON.stringify(selectedMoods))}`);
    } catch (error) {
      console.error('Error:', error);
      // Fallback navigation
      router.push(`/emotion-rate?currentIndex=0&moods=${encodeURIComponent(JSON.stringify(selectedMoods))}`);
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    // Track if animations have run to prevent repeats
    let hasAnimated = false;
    const splitTextInstances: SplitText[] = [];
    const animationTweens: gsap.core.Tween[] = [];
  
    const runAnimations = () => {
      if (hasAnimated) return;
      hasAnimated = true;
  
      // Create split text animations
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
  
      createSplitAnimation(".split");
      createSplitAnimation(".split-2");
      createSplitAnimation(".split-3");
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
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <section className='min-h-screen relative flex flex-col justify-center items-center font-montserrat gap-10 p-6'>
      <div className='max-w-5xl p-20 max-sm:p-6 max-lg:p-10 backdrop-blur-xl bg-white/30 rounded-3xl border-2'>
        <div className='flex flex-col gap-10 text-center text-black'>
          <h1 className='text-3xl max-md:text-2xl font-bold text-[#3E4352] split'>How are you feeling today?</h1>
          <h2 className='text-2xl max-md:text-xl font-semibold text-[#3E4352] split-2'>Select all that apply to your current state.</h2>
          <div className='grid grid-cols-6 max-md:grid-cols-2 max-lg:grid-cols-3 gap-4'>
            {moods.map((mood) => (
              <div 
                key={mood.id}
                className={`flex flex-col justify-center items-center p-4 rounded-xl cursor-pointer transition-all moods hover:scale-110 duration-200 ${
                  selectedMoods.some(m => m.id === mood.id) 
                    ? 'bg-[#A44167]/20 border-2 border-[#A44167]' 
                    : 'hover:bg-white/20'
                }`}
                onClick={() => handleMoodSelect(mood)}
              >
                <Image src={mood.icon} alt={`${mood.name} Face`} width={80} height={80}  />
                <h1 className='font-semibold'>{mood.name}</h1>
              </div>
            ))}
          </div>
          <p className='font-semibold max-md:text-xl text-2xl text-[#3E4352] mt-10 split-3'>
            {selectedMoods.length > 0 
              ? `You've selected: ${selectedMoods.map(m => m.name).join(', ')}` 
              : 'Choose the feelings that are closest to how you are feeling'}
          </p>
        </div>
      </div>
      <div className=''>
        <button 
          onClick={handleSubmit}
          disabled={selectedMoods.length === 0 || isLoading}
          className={`text-white bg-[#A44167] max-sm:text-lg text-2xl font-semibold md:w-sm py-4 rounded-[5rem] px-8 ${
            selectedMoods.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          } ${isLoading ? 'opacity-70' : ''}`}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </section>
  );
};

export default MoodSelection;