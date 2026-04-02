import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  postalAddress: string;
  streetAddress: string;
  counterparty: string;
}

interface Props {
  onSubmit: (profile: UserProfile) => void;
  onBack: () => void;
  categoryTitle: string;
}

const UserInfoForm = ({ onSubmit, onBack, categoryTitle }: Props) => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
    postalAddress: '',
    streetAddress: '',
    counterparty: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!profile.fullName.trim()) errs.fullName = 'Ange ditt namn';
    if (!profile.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) errs.email = 'Ange en giltig e-postadress';
    if (!profile.postalAddress.trim()) errs.postalAddress = 'Ange postnummer och ort';
    if (!profile.counterparty.trim()) errs.counterparty = 'Ange företagets namn';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(profile);
  };

  const field = (key: keyof UserProfile, label: string, required: boolean, placeholder: string, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={profile[key]}
        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
          errors[key] ? 'border-destructive' : 'border-border'
        }`}
      />
      {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
      <div className="card-elevated p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Dina uppgifter</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Dessa uppgifter används i ditt kravbrev. Fyll i innan vi går vidare till frågorna om ditt ärende.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('fullName', 'Förnamn och efternamn', true, 'Anna Andersson')}
          {field('email', 'E-postadress', true, 'anna@exempel.se', 'email')}
          {field('phone', 'Telefonnummer', false, '070-123 45 67', 'tel')}
          {field('postalAddress', 'Postnummer och ort', true, '114 33 Stockholm')}
          {field('streetAddress', 'Gatuadress', false, 'Storgatan 1')}
          {field('counterparty', 'Vilket företag gäller ärendet?', true, `T.ex. SAS, IKEA, Telia`)}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="ghost" onClick={onBack} className="gap-1.5">
              Tillbaka
            </Button>
            <Button type="submit" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              Nästa <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default UserInfoForm;
