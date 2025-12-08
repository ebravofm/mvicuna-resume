import Image from 'next/image';
import { ReactNode } from 'react';
import AboutMe from 'src/components/articles/about-me';
import Achievements from 'src/components/articles/achievements';
import AdditionalInfo from 'src/components/articles/additional-info';
import ContactInformation from 'src/components/articles/contact-info';
import Professional from 'src/components/articles/professional';
import Skills from 'src/components/articles/skills';

export default function Page(): ReactNode {
  return (
    <div className="container space-y-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <AboutMe className="md:col-span-2" />
        <div className="overflow-hidden rounded-xl">
          <Image
            alt="Profile Picture"
            className="h-auto w-full object-cover"
            height={1164}
            src="https://res.cloudinary.com/dddrdmyfc/image/upload/v1765161081/2_oj0n08.jpg"
            width={832}
          />
        </div>
      </div>

      <ContactInformation />
      <Skills />

      <div className="overflow-hidden rounded-xl">
        <Image
          alt="Work Environment"
          className="h-auto w-full object-cover"
          height={2538}
          src="https://res.cloudinary.com/dddrdmyfc/image/upload/v1765161081/3_tsdnzu.jpg"
          width={3480}
        />
      </div>

      <Professional />
      <Achievements />
      <AdditionalInfo />
    </div>
  );
}
