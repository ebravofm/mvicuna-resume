import { ShieldExclamationIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';
import Prose from 'src/components/prose/prose';
import SectionHeading from 'src/components/section-heading/section-heading';

export default function DisclaimerPage(): ReactNode {
  const disclaimerContent = `
    <p>
      La información publicada en este sitio web, incluyendo mi currículum vitae, experiencia profesional, formación académica y demás antecedentes, tiene fines exclusivamente informativos y de evaluación profesional por parte de potenciales empleadores, reclutadores o colaboradores.
    </p>
    <p>
      Todo el contenido constituye información personal y se encuentra protegido por la legislación chilena vigente en materia de protección de datos personales y propiedad intelectual. Su reproducción, distribución, modificación o uso para fines distintos a los señalados, sin mi autorización previa y por escrito, queda expresamente prohibido.
    </p>
    <p>
      En particular, se prohíbe el uso de estos datos para suplantación de identidad, creación de perfiles falsos, fraudes, actividades ilícitas o cualquier uso que pueda afectar mi honra, reputación o patrimonio. Quienes acceden a esta información son responsables del uso que hagan de ella y aceptan que cualquier mal uso podrá ser puesto en conocimiento de las autoridades competentes.
    </p>
    <p>
      Este aviso no constituye asesoría legal ni sustituye la aplicación directa de la normativa vigente; su propósito es informar el alcance del uso permitido de la información y dejar constancia de que me reservo el derecho de ejercer las acciones que estimare pertinentes frente a un uso indebido.
    </p>
  `;

  return (
    <div className="container space-y-12 py-12">
      <article className="mx-auto max-w-3xl space-y-8">
        <div className="flex justify-center">
          <SectionHeading
            Icon={ShieldExclamationIcon}
            level={2}
            text="Aviso sobre uso de información y responsabilidad"
          />
        </div>

        <Prose html={disclaimerContent} />
      </article>
    </div>
  );
}

