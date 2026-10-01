import React, { useRef } from 'react';
import { X, Download, Printer, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { StudentInfo, DeveloperProfile, ThemeConfig } from '../types';
import { sound } from '../utils/audio';

interface SertifikatModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentInfo;
  developer: DeveloperProfile;
  score: number | null;
  theme?: ThemeConfig;
}

export const SertifikatModal: React.FC<SertifikatModalProps> = ({
  isOpen,
  onClose,
  student,
  developer,
  score,
  theme,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const displayScore = score !== null ? score : 85;
  const gradeLabel =
    displayScore >= 90
      ? 'Sangat Memuaskan (A+)'
      : displayScore >= 75
      ? 'Memuaskan (A)'
      : displayScore >= 60
      ? 'Cukup Baik (B)'
      : 'Perlu Penguatan (C)';

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const appreciationText =
    theme?.sertifikat?.appreciationText ||
    'Atas keberhasilan menuntaskan seluruh petualangan pembelajaran:';
  const themeTitleOnCert =
    theme?.sertifikat?.themeTitleOnCert ||
    `${(theme?.mataPelajaran || 'IPAS').toUpperCase()} ${(theme?.kelas || 'KELAS III SD').toUpperCase()}: ${(theme?.judulTema || 'DAHULU, KINI, DAN NANTI').toUpperCase()}`;
  const subText =
    theme?.sertifikat?.subText || 'Materi Kurikulum Merdeka Fase B';

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleDownload = () => {
    sound.playClick();
    sound.playFanfare();

    // Render cleanly onto an offscreen canvas for high-res PNG download
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 840);
    bgGrad.addColorStop(0, '#fffdfa');
    bgGrad.addColorStop(1, '#fff5eb');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 840);

    // Decorative Borders
    ctx.strokeStyle = '#d97706'; // Amber gold
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 780);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 1104, 744);

    // Corner decorative motifs
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(50, 50);
    drawCorner(1150, 50);
    drawCorner(50, 790);
    drawCorner(1150, 790);

    // Header Top Label
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', 600, 95);

    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('MULTIMEDIA PEMBELAJARAN INTERAKTIF (MPI) KURIKULUM MERDEKA FASE B', 600, 120);

    // Main Certificate Title
    ctx.fillStyle = '#1e293b';
    ctx.font = '900 42px sans-serif';
    ctx.fillText('PIAGAM PENGHARGAAN HASIL BELAJAR', 600, 185);

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Nomor: MPI-LUMI/IPAS-3/' + new Date().getFullYear() + '/089', 600, 215);

    // Decorative line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(400, 235);
    ctx.lineTo(800, 235);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#475569';
    ctx.font = 'normal 18px sans-serif';
    ctx.fillText('Piagam ini diberikan dengan bangga dan apresiasi setinggi-tingginya kepada:', 600, 275);

    // Student Name
    ctx.fillStyle = '#be123c'; // Rose dark
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(student.name.toUpperCase(), 600, 330);

    // Student Class & Subject
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 20px sans-serif';
    const classText = `Kelas: ${student.className}${student.studentNumber ? ` · No. Absen: ${student.studentNumber}` : ''}`;
    ctx.fillText(classText, 600, 365);

    ctx.fillStyle = '#475569';
    ctx.font = 'normal 18px sans-serif';
    ctx.fillText(appreciationText, 600, 410);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(themeTitleOnCert, 600, 445);

    // Score Badge Box
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(360, 480, 480, 80, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('HASIL EVALUASI & ASESMEN HOTS', 600, 508);

    ctx.fillStyle = '#b45309';
    ctx.font = '900 28px sans-serif';
    ctx.fillText(`NILAI: ${displayScore} / 100 · Predikat: ${gradeLabel}`, 600, 542);

    // Bottom Date & Signatures
    ctx.textAlign = 'left';
    ctx.fillStyle = '#334155';
    ctx.font = 'normal 16px sans-serif';
    ctx.fillText(`Diterbitkan pada: ${currentDate}`, 120, 640);
    ctx.fillText(`Media: MPI Model Desain Lumi H5P`, 120, 665);
    ctx.fillText(`Status: TERVERIFIKASI DIGITAL`, 120, 690);

    // Stamp / Medal
    ctx.save();
    ctx.beginPath();
    ctx.arc(600, 680, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LUMI MPI', 600, 675);
    ctx.fillText('★ RESMI ★', 600, 692);
    ctx.restore();

    // Teacher Signature on Right
    ctx.textAlign = 'center';
    ctx.fillStyle = '#334155';
    ctx.font = 'normal 15px sans-serif';
    ctx.fillText('Guru Pengembang & Pengampu Mapel,', 980, 620);

    // Signature line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(860, 700);
    ctx.lineTo(1100, 700);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(developer.name, 980, 725);

    ctx.fillStyle = '#64748b';
    ctx.font = 'normal 13px sans-serif';
    ctx.fillText(developer.institution, 980, 745);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Piagam-IPAS-Kelas3-${student.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-amber-200 overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="p-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-100" />
            <div>
              <h3 className="font-bold text-base sm:text-lg font-display leading-tight">
                Piagam Hasil Belajar Siswa
              </h3>
              <p className="text-xs text-amber-100">
                Bukti ketuntasan materi {theme?.judulTema || 'Dahulu, Kini, dan Nanti'} • {theme?.mataPelajaran || 'IPAS'} {theme?.kelas || 'Kelas III SD'}
              </p>
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

        {/* Certificate Visual Preview */}
        <div className="p-4 sm:p-6 bg-slate-100 flex justify-center">
          <div
            ref={certificateRef}
            className="w-full max-w-3xl bg-[#fffdf9] p-6 sm:p-8 rounded-2xl border-8 border-double border-amber-600 shadow-xl relative text-center text-slate-800"
          >
            {/* Inner Gold Border */}
            <div className="border border-amber-300 p-4 sm:p-6 rounded-lg relative">
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 text-amber-600 text-xs">◆</div>
              <div className="absolute top-2 right-2 text-amber-600 text-xs">◆</div>
              <div className="absolute bottom-2 left-2 text-amber-600 text-xs">◆</div>
              <div className="absolute bottom-2 right-2 text-amber-600 text-xs">◆</div>

              {/* Institution Header */}
              <div className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">
                Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi
              </div>
              <div className="text-[9px] sm:text-[11px] font-semibold text-slate-500">
                MULTIMEDIA PEMBELAJARAN INTERAKTIF (MPI) KURIKULUM MERDEKA FASE B
              </div>

              {/* Certificate Main Title */}
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 font-display mt-3 mb-1">
                PIAGAM HASIL BELAJAR
              </h2>
              <div className="text-[10px] text-amber-700 font-mono">
                No. Registrasi: MPI-LUMI/IPAS-3/{new Date().getFullYear()}/089
              </div>

              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-3" />

              <p className="text-xs sm:text-sm text-slate-600">
                Diberikan dengan penuh apresiasi kepada peserta didik:
              </p>

              {/* Student Name */}
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-display my-2 tracking-wide">
                {student.name}
              </div>

              <div className="inline-block text-xs font-bold text-slate-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3">
                Kelas: {student.className} {student.studentNumber && `· Absen #${student.studentNumber}`}
              </div>

              <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
                {appreciationText} <strong>{theme?.judulTema || 'Dahulu, Kini, dan Nanti'}</strong> ({subText}).
              </p>

              {/* Score Highlight Box */}
              <div className="my-3 p-3 bg-amber-50/80 rounded-2xl border border-amber-300 max-w-sm mx-auto">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  Pencapaian Asesmen HOTS
                </span>
                <div className="text-xl font-black text-amber-700">
                  Nilai: {displayScore} / 100
                </div>
                <div className="text-xs font-semibold text-amber-900 mt-0.5">
                  Predikat: {gradeLabel}
                </div>
              </div>

              {/* Lencana Pencapaian pada Piagam */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 my-2 text-[10px]">
                <span className="font-bold text-slate-500">Koleksi Lencana:</span>
                {(theme?.badges || []).slice(0, 5).map((b) => (
                  <span
                    key={b.id}
                    className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200"
                  >
                    {b.icon} {b.nickname}
                  </span>
                ))}
              </div>

              {/* Footer details & Signatures */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-200 text-left text-xs">
                <div className="flex flex-col justify-end">
                  <span className="text-[10px] text-slate-600">Diterbitkan pada:</span>
                  <span className="font-bold text-slate-800">{currentDate}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Lulus &amp; Terverifikasi Sistem</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-600 block">Guru Pengembang / Pengampu,</span>
                  <div className="h-10 flex items-center justify-end font-serif italic text-amber-800 text-sm">
                    {developer.name}
                  </div>
                  <div className="font-bold text-slate-800 text-xs">{developer.name}</div>
                  <div className="text-[10px] text-slate-600">{developer.institution}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sertifikat dapat disimpan dalam format gambar resolusi tinggi (PNG)</span>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak (PDF)</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Sertifikat (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
