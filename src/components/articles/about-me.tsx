import { personal, Salary } from '@content';
import { UserIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';
import Prose from 'src/components/prose/prose';
import SectionHeading from 'src/components/section-heading/section-heading';

interface AboutMeProperties {
  salary?: Salary;
}

export default function AboutMe({ salary }: AboutMeProperties): ReactNode {
  return (
    <article className="space-y-4">
      <SectionHeading Icon={UserIcon} level={3} text="Sobre Mí" />
      <Prose html={personal.body.html} />

      {salary && (
        <div className="space-y-1">
          {salary.currentSalary && (
            <div>
              <strong>Salario actual:</strong> {salary.currentSalary}
            </div>
          )}
          {salary.desiredSalary && (
            <div>
              <strong>Salario deseado:</strong> {salary.desiredSalary}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
