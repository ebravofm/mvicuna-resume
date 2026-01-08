'use client';

import { DocumentIcon } from '@heroicons/react/24/solid';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { ReactNode, useEffect, useRef, useState } from 'react';
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    organization: '',
    role: '',
    reason: '',
  });
  const turnstileRef = useRef<TurnstileInstance>(null);
  const turnstileTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para activar la animación después del montaje
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitStatus('idle');
      setFormData({
        name: '',
        email: '',
        organization: '',
        role: '',
        reason: '',
      });
    }, 500); // Esperar a que termine la animación de salida
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    turnstileTokenRef.current = null;

    try {
      // Ejecutar Turnstile si está configurado
      let turnstileToken: string | undefined;
      
      if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && turnstileRef.current) {
        try {
          // Resetear el token anterior
          turnstileRef.current.reset();
          turnstileTokenRef.current = null;
          
          // Ejecutar Turnstile
          turnstileRef.current.execute();
          
          // Esperar un momento para que el callback onSuccess pueda ejecutarse
          await new Promise((resolve) => setTimeout(resolve, 100));
          
          // Si el callback ya proporcionó el token, usarlo
          if (turnstileTokenRef.current) {
            turnstileToken = turnstileTokenRef.current;
          } else {
            // Si no, esperar el token con timeout más largo (30 segundos)
            // y polling cada 100ms
            turnstileToken = await turnstileRef.current.getResponsePromise(30000, 100);
            
            // Si aún no tenemos token pero tenemos uno en el ref (de onSuccess), usarlo
            if (!turnstileToken && turnstileTokenRef.current) {
              turnstileToken = turnstileTokenRef.current;
            }
          }
          
          if (!turnstileToken) {
            throw new Error('No se pudo obtener el token de verificación');
          }
        } catch (error) {
          console.error('Error obteniendo token de Turnstile:', error);
          // Si es un error de dominio no autorizado, mostrar mensaje más claro
          if (error instanceof Error && error.message.includes('110200')) {
            console.error(
              '⚠️ Error 110200: El dominio no está autorizado. ' +
              'Para desarrollo local, agrega "localhost" en Cloudflare Turnstile o usa la clave de prueba.'
            );
          }
          setSubmitStatus('error');
          setIsSubmitting(false);
          turnstileRef.current?.reset();
          turnstileTokenRef.current = null;
          return;
        }
      } else if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        console.warn('NEXT_PUBLIC_TURNSTILE_SITE_KEY no está configurada');
      }

      const response = await fetch('/api/cv-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al enviar la solicitud');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        organization: '',
        role: '',
        reason: '',
      });

      // Resetear Turnstile
      turnstileRef.current?.reset();
      turnstileTokenRef.current = null;

      // Cerrar el formulario después de 2 segundos
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      // Resetear Turnstile en caso de error
      turnstileRef.current?.reset();
      turnstileTokenRef.current = null;
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-500 ease-out"
          style={{ opacity: isAnimating ? 1 : 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <div
            className="bg-neutral-1 border-neutral-6 w-full max-w-lg rounded-lg border p-6 shadow-lg transition-all duration-500 ease-out"
            style={{
              opacity: isAnimating ? 1 : 0,
              transform: isAnimating ? 'scale(1)' : 'scale(0.9)',
            }}
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

              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  options={{
                    size: 'invisible',
                    execution: 'execute',
                    appearance: 'execute',
                    retry: 'auto',
                    retryInterval: 3000,
                  }}
                  onSuccess={(token) => {
                    console.log('Turnstile token obtenido exitosamente');
                    turnstileTokenRef.current = token;
                  }}
                  onError={(error) => {
                    console.error('Error en Turnstile:', error);
                    // Error 110200: dominio no autorizado
                    if (error === '110200') {
                      console.error(
                        '⚠️ Error 110200: El dominio no está autorizado en Cloudflare Turnstile. ' +
                        'Agrega "localhost" (para desarrollo) o tu dominio en la configuración de Turnstile.'
                      );
                    }
                    turnstileTokenRef.current = null;
                  }}
                  onExpire={() => {
                    console.warn('Token de Turnstile expirado');
                    turnstileTokenRef.current = null;
                  }}
                  onTimeout={() => {
                    console.warn('Timeout en Turnstile');
                    turnstileTokenRef.current = null;
                  }}
                />
              ) : (
                <div className="text-danger-11 text-xs">
                  ⚠️ Turnstile no configurado (NEXT_PUBLIC_TURNSTILE_SITE_KEY faltante)
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
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

