'use client';

import { DocumentIcon } from '@heroicons/react/24/solid';
import { ReactNode, useState } from 'react';
import { Button } from 'src/components/button/button';
import { Heading } from 'src/components/heading/heading';

interface FormData {
  name: string;
  email: string;
  organization: string;
  role: string;
  reason: string;
}

export default function CVRequestForm(): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    organization: '',
    role: '',
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/cv-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la solicitud');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        organization: '',
        role: '',
        reason: '',
      });
      
      // Cerrar el formulario después de 2 segundos
      setTimeout(() => {
        setIsOpen(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="lg">
        <DocumentIcon />
        Solicitar CV
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
              setSubmitStatus('idle');
            }
          }}
        >
          <div
            className="bg-neutral-1 border-neutral-6 w-full max-w-lg rounded-lg border p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <Heading level={2} className="mb-2">
                Solicitar CV
              </Heading>
              <p className="text-neutral-11 text-sm">
                Si deseas recibir mi CV actualizado, completa el siguiente formulario. Revisaré tu solicitud y te responderé directamente por correo.
              </p>
              <p className="text-neutral-11 mt-2 text-sm italic">
                If you'd like to receive my updated résumé, please complete the form below. I'll review your request and get back to you directly by email.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-neutral-11 mb-1 block text-sm font-medium">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="border-neutral-7 bg-neutral-1 text-neutral-12 focus:border-accent-8 focus:ring-accent-8 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-neutral-11 mb-1 block text-sm font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="border-neutral-7 bg-neutral-1 text-neutral-12 focus:border-accent-8 focus:ring-accent-8 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                />
              </div>

              <div>
                <label htmlFor="organization" className="text-neutral-11 mb-1 block text-sm font-medium">
                  Organización / Empresa
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="border-neutral-7 bg-neutral-1 text-neutral-12 focus:border-accent-8 focus:ring-accent-8 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                />
              </div>

              <div>
                <label htmlFor="role" className="text-neutral-11 mb-1 block text-sm font-medium">
                  Cargo / Rol
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border-neutral-7 bg-neutral-1 text-neutral-12 focus:border-accent-8 focus:ring-accent-8 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                />
              </div>

              <div>
                <label htmlFor="reason" className="text-neutral-11 mb-1 block text-sm font-medium">
                  Motivo de interés *
                </label>
                <select
                  id="reason"
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={handleChange}
                  className="border-neutral-7 bg-neutral-1 text-neutral-12 focus:border-accent-8 focus:ring-accent-8 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                >
                  <option value="">Selecciona un motivo</option>
                  <option value="reclutamiento">Reclutamiento</option>
                  <option value="networking">Networking</option>
                  <option value="colaboracion-academica">Colaboración académica</option>
                  <option value="consulta-profesional">Consulta profesional</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {submitStatus === 'success' && (
                <div className="bg-accent-4 text-accent-11 rounded-md p-3 text-sm">
                  ¡Solicitud enviada exitosamente! Te responderé pronto por correo.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-danger-4 text-danger-11 rounded-md p-3 text-sm">
                  Error al enviar la solicitud. Por favor, intenta nuevamente.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setSubmitStatus('idle');
                    setFormData({
                      name: '',
                      email: '',
                      organization: '',
                      role: '',
                      reason: '',
                    });
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

