"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Complete_Logo from "../../../public/assets/Group 1597881205.svg";
import Card1 from "../../../public/assets/cards/Card Container.png";
import Card2 from "../../../public/assets/cards/Card Container (1).png";
import Card3 from "../../../public/assets/cards/Card Container (2).png";
import Card4 from "../../../public/assets/cards/Card Container (3).png";
import ReminderModal from "../components/RemainderModal"; // Adjust the import path as needed
import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";
import gsap from "gsap";
const FinalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logo = useRef(null)
  const handleSaveReminder = (time: string, period: string, days: string[]) => {
    console.log("Reminder set for:", time, period, days);
    // Here you would typically send this data to your backend or store it
  };

  useEffect(() => {
      gsap.set(logo.current,{scale: 0.3})
      gsap.to(logo.current,{
        scale: 1,
        duration: 1.2,
        ease: "elastic.out"
      })
  },[])

  return (
    <section className="min-h-screen relative flex flex-col justify-center items-center font-montserrat gap-4 max-md:py-10">
     <div className="max-w-5xl w-full flex justify-between">
        <div>
      <Link href="/" className="text-[#C94A0D] flex gap-2"><span className="bg-white rounded-[100%]"><CircleArrowLeft/></span>Start Again</Link>
        </div>
       {/*  <div>
       <Link href="/" className="flex gap-2 text-black">Skip<span className=""><CircleArrowRight color="black"/></span></Link>
        </div>*/}
      </div> 
      <div
        style={{
          backgroundImage: "url(/assets/Subtract.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="max-w-5xl p-10"
      >
        <div className="flex flex-col gap-10 text-center justify-center items-center">
          <Image ref={logo} src={Complete_Logo} alt="Completion logo" />
          <h1 className="text-2xl font-semibold text-[#4E2C84]">
            Great job completing your session!
          </h1>
          <h2 className="text-[#4E2C84]">
            Want to make this a habbit? Set a remainder for next time.
          </h2>
          <div className="flex max-sm:flex-col gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="border text-2xl border-[#005840] text-[#005840] py-4 px-6 font-semibold rounded-3xl"
            >
              Set Remainder
            </button>
            <button className="bg-[#005840] py-4 px-6 text-2xl font-semibold rounded-3xl">
              View Analytics
            </button>
          </div>
          <div className="flex flex-col justify-start w-full">
            <h1 className="text-left text-black font-semibold text-2xl">
              My Reccomendations
            </h1>
            <div className="flex overflow-scroll">
              <Image src={Card1} alt="Card 1" />
              <Image src={Card2} alt="Card 2" />
              <Image src={Card3} alt="Card 3" />
              <Image src={Card4} alt="Card 4" />
            </div>
          </div>
        </div>
      </div>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReminder}
      />
    </section>
  );
};

export default FinalPage;
