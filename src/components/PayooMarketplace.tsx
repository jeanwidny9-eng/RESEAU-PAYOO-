import React from 'react';
import { ShoppingBag, Phone, MapPin, Tag } from 'lucide-react';
import { PayooProduct } from '../types';

interface PayooMarketplaceProps {
  products: PayooProduct[];
}

export const PayooMarketplace: React.FC<PayooMarketplaceProps> = ({ products }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 text-white p-4">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-zinc-950 to-teal-950 border border-emerald-500/40 space-y-2">
        <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
          Mache PAYOO Rézo 🇭🇹
        </span>
        <h1 className="text-2xl font-black text-white">Mache Dijital Pwodui Ayisyen</h1>
        <p className="text-xs text-zinc-300">
          Achte ak vann pwodui lokal ak ekipman pou kreyatè pa w yo fasilman sou MonCash ak NatCash.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((prod) => (
          <div key={prod.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="rounded-xl overflow-hidden h-44 bg-zinc-950">
              <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md">
                  {prod.category}
                </span>
                <span className="text-xs font-black text-amber-300">
                  {prod.priceHTG.toLocaleString()} HTG
                </span>
              </div>
              <h3 className="text-sm font-black text-white">{prod.title}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2">{prod.description}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800 pt-2">
              <span className="flex items-center gap-1 text-zinc-300 font-bold">
                <MapPin className="w-3 h-3 text-amber-400" />
                {prod.location}
              </span>
              <a
                href={`tel:${prod.contactPhone}`}
                className="px-3 py-1 rounded-xl bg-emerald-500 text-black font-black text-xs flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                Théléphon
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
