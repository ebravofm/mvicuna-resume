import { allSkills } from '@content';
import { CheckIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';
import { Heading } from 'src/components/heading/heading';
import Prose from 'src/components/prose/prose';
import SectionHeading from 'src/components/section-heading/section-heading';
import StarRating from 'src/components/star-rating/star-rating';

interface SkillsProperties {
  className?: string;
}

export default function Skills({ className }: SkillsProperties): ReactNode {
  return (
    <article className={`space-y-4 ${className ?? 'md:col-span-3'}`}>
      <SectionHeading
        Icon={CheckIcon}
        level={3}
        text="Habilidades y Competencias"
      />

      <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
        {allSkills.map((skill, skillIndex) => (
          <div className="space-y-2" key={skill._id}>
            <Heading level={4}>
              <div className="flex items-center gap-2">
                <StarRating
                  stars={(allSkills.length - skillIndex) as 1 | 2 | 3}
                />
                {skill.title}
              </div>
            </Heading>

            <Prose className="text-neutral-11" html={skill.body.html} />
          </div>
        ))}
      </div>
    </article>
  );
}
