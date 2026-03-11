import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <div className="container-bfb max-w-md">
        <h1 className="font-serif text-6xl text-cream-300 mb-4">404</h1>
        <h2 className="font-serif text-2xl text-earth-900 mb-3">
          Den side er ikke her
        </h2>
        <p className="text-earth-600 mb-8">
          Maske er opskriften flyttet, maske eksisterede den aldrig.
          Tjek opskriftslisten – der er masser af godt.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Gå til forsiden
          </Link>
          <Link href="/opskrifter" className="btn-secondary">
            Se opskrifter
          </Link>
        </div>
      </div>
    </div>
  );
}
