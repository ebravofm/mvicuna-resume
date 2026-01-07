import { links } from '@config/links';
import { personal } from '@content';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from 'src/components/button/button';
import { fullName } from 'src/helpers/utilities';

export default function Footer(): ReactNode {
  return (
    <footer className="border-neutral-6 bg-neutral-2 text-neutral-12 border-t py-12">
      <div className="container space-y-8 text-center">
        <div className="flex flex-wrap justify-center gap-3">
          {links.map((link) => (
            <Button
              asChild
              className="h-12 w-12 rounded-full"
              key={link.title}
              size="icon"
            >
              <a href={link.href}>
                <span className="sr-only">
                  {personal.givenName} on {link.title}
                </span>
                <link.icon aria-hidden size={18} />
              </a>
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <div>
            Copyright © {new Date().getFullYear()} {fullName}
          </div>
          <div className="text-neutral-11 text-xs">
            <Link
              href="/disclaimer"
              className="hover:text-neutral-12 transition-colors underline-offset-4 hover:underline"
            >
              Aviso legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
