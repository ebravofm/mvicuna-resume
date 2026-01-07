import {
  allAchievements,
  allProfessionalExperiences,
  IsoDateTimeString,
  personal,
} from '@content';
import { ClassValue } from 'class-variance-authority/types';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const fullName = `${personal.givenName} ${personal.familyName}`;

export const initials = `${personal.givenName.slice(0, 1)}${personal.familyName.slice(0, 1)}`;

export const sortedProfessionalExperiences =
  allProfessionalExperiences.toSorted((a, b) => {
    // Orden personalizado: 02-codelco, 03-outotec, 04-09 (agrupados), 01-asesora
    const getOrder = (id: string): number => {
      if (id.includes('02-codelco')) return 1;
      if (id.includes('03-outotec')) return 2;
      if (id.includes('04-penta') || id.includes('05-sec') || id.includes('06-sii') || 
          id.includes('07-conexus') || id.includes('08-minera-alumbrera') || id.includes('09-enaex')) return 3;
      if (id.includes('01-asesora')) return 4;
      return 5; // fallback para cualquier otro archivo
    };

    return getOrder(a._id) - getOrder(b._id);
  });

export const sortedAchievements = allAchievements.toSorted((a, b) => {
  return b.completionYear - a.completionYear;
});

export function getFormattedDate(dateTimeString: IsoDateTimeString): string {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
