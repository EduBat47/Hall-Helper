import type { ComplaintCategory } from './types';
import { Wrench, Zap, Thermometer, Sparkles, HardHat, CheckCircle, type LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export const categoryIcons: Record<
  ComplaintCategory | 'Resolved',
  ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
> = {
  Plumbing: Wrench,
  Electrical: Zap,
  Heating: Thermometer,
  Cleanliness: Sparkles,
  Maintenance: HardHat,
  Resolved: CheckCircle,
};
