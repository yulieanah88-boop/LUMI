import React from 'react';
import { X, Phone, AlertCircle, Shield, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface SafetyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyHelpModal: React.FC<SafetyHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-rose-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-red-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
              🆘
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight font-display">
                Pusat Bantuan &amp; Layanan Pengaduan Anak
              </h3>
              <p className="text-xs text-rose-100">Kamu berani, kamu dilindungi, dan kamu tidak sendirian</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-700 text-sm">
          {/* Key Message */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <Shield className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <strong className="text-sm block mb-1">Ingat Selalu Pesan Penting Ini:</strong>
              Jika pernah atau sedang mengalami hal yang membuatmu risih, takut, atau tidak nyaman, <strong>ITU SAMA SEKALI BUKAN SALAHMU!</strong> Jangan disimpan sendiri. Segera beritahu orang dewasa tepercaya di sekitarmu.
            </div>
          </div>

          {/* Official Helplines */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Saluran Telepon &amp; Bantuan Resmi:
            </span>

            {/* SAPA 129 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-rose-300 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-500" />
                  <span>SAPA 129 (Kemen PPPA RI)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Resmi 24 Jam
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                Layanan Sahabat Perempuan dan Anak untuk perlindungan dan pendampingan psikologis.
              </p>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <a
                  href="tel:129"
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold inline-flex items-center gap-1 shadow-xs"
                >
                  <Phone className="w-3 h-3" />
                  <span>Hotline: 129</span>
                </a>
                <span className="text-slate-400 font-mono">WhatsApp: 08111-129-129</span>
              </div>
            </div>

            {/* PPA POLRI */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-sky-500" />
                  <span>Unit PPA Kepolisian RI</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  Hotline 110
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Hubungi kantor polisi terdekat atau layanan darurat polisi 110 untuk perlindungan segera dari ancaman bahaya fisik.
              </p>
            </div>
          </div>

          {/* Verifikasi Guru Note */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-snug">
            <strong>Catatan untuk Guru/Pendamping:</strong> Mohon memverifikasi nomor kontak layanan perlindungan anak yang berlaku di daerah/kabupaten/kota tempat sekolah berada.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
