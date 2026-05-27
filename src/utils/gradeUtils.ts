export interface WAECGrade {
  grade: string;
  desc: string;
  gp: number; // Grade point for GPA calculations (A1=5.0, B2/3=4.0, C4-6=3.0, D7-E8=2.0, F9=0.0)
  colorClass: string;
  bgClass: string;
}

export function getWAECGrade(percentage: number): WAECGrade {
  if (percentage >= 75) {
    return { grade: 'A1', desc: 'Excellent', gp: 5.0, colorClass: 'text-emerald-700', bgClass: 'bg-emerald-50 border-emerald-100' };
  }
  if (percentage >= 70) {
    return { grade: 'B2', desc: 'Very Good', gp: 4.0, colorClass: 'text-teal-700', bgClass: 'bg-teal-50 border-teal-100' };
  }
  if (percentage >= 65) {
    return { grade: 'B3', desc: 'Good', gp: 4.0, colorClass: 'text-indigo-700', bgClass: 'bg-indigo-50 border-indigo-100' };
  }
  if (percentage >= 60) {
    return { grade: 'C4', desc: 'Credit (Upper)', gp: 3.0, colorClass: 'text-blue-700', bgClass: 'bg-blue-50 border-blue-100' };
  }
  if (percentage >= 55) {
    return { grade: 'C5', desc: 'Credit (Middle)', gp: 3.0, colorClass: 'text-sky-700', bgClass: 'bg-sky-50 border-sky-100' };
  }
  if (percentage >= 50) {
    return { grade: 'C6', desc: 'Credit (Lower)', gp: 3.0, colorClass: 'text-slate-700', bgClass: 'bg-slate-50 border-slate-200' };
  }
  if (percentage >= 45) {
    return { grade: 'D7', desc: 'Pass (Fair)', gp: 2.0, colorClass: 'text-amber-700', bgClass: 'bg-amber-50 border-amber-100' };
  }
  if (percentage >= 40) {
    return { grade: 'E8', desc: 'Pass (Weak)', gp: 2.0, colorClass: 'text-orange-700', bgClass: 'bg-orange-50 border-orange-100' };
  }
  return { grade: 'F9', desc: 'Fail', gp: 0.0, colorClass: 'text-rose-700', bgClass: 'bg-rose-50 border-rose-100' };
}

export function calculateTermPerformance(termGrades: any[]) {
  if (termGrades.length === 0) {
    return {
      gpa: 'N/A',
      gpaValue: 0,
      standing: 'No Record',
      comment: 'No grades are filed for this academic term segment.',
      colorClass: 'text-neutral-500'
    };
  }

  // Calculate GPA based on WAEC GP values (0.0 to 5.0 scale)
  let totalGP = 0;
  termGrades.forEach(g => {
    const perc = Math.round((g.score / g.maxScore) * 100);
    totalGP += getWAECGrade(perc).gp;
  });

  const gpaValue = Number((totalGP / termGrades.length).toFixed(2));
  let standing = 'Weak Pass';
  let comment = 'Needs urgent scholastic guidance and intensive tutorial reviews.';
  let colorClass = 'text-rose-600';

  if (gpaValue >= 4.5) {
    standing = 'Distinction (Excellent)';
    comment = 'Outstanding scholastic brilliance. Keep representing the New Unique Academy elite standards.';
    colorClass = 'text-emerald-700';
  } else if (gpaValue >= 3.5) {
    standing = 'Upper Credit (Very Good)';
    comment = 'Commendable academic proficiency. Poised for high-tier excellence next term.';
    colorClass = 'text-teal-700';
  } else if (gpaValue >= 2.5) {
    standing = 'Credit (Satisfactory)';
    comment = 'Good progress. Dedicate more focus to examinations to secure an Upper distinction.';
    colorClass = 'text-blue-700';
  } else if (gpaValue >= 1.5) {
    standing = 'Pass (Fair)';
    comment = 'Meets minimum promotion standards. General score improvement is highly recommended.';
    colorClass = 'text-amber-700';
  }

  return {
    gpa: gpaValue.toFixed(2),
    gpaValue,
    standing,
    comment,
    colorClass
  };
}
