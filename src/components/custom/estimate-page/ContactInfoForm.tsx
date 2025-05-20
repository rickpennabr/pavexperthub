'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, FieldValues, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Map, Hash, Link } from 'lucide-react';

interface ContactInfoFormProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  showOtherInput: boolean;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  register,
  errors,
  showOtherInput,
  handlePhoneChange,
  handleCityChange
}) => {
  const renderErrorMessage = (
    error: FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>> | undefined
  ) => {
    if (error && typeof error.message !== 'undefined') {
      return <p className="mt-1 text-sm text-red-600">{String(error.message)}</p>;
    }
    return null;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Referral Source */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-1">
          <Link className="h-5 w-5 text-red-500" />
          <label htmlFor="referral" className="text-base font-medium text-black">
            How did you hear about us? *
          </label>
        </div>
        <div className="relative">
          <select
            id="referral"
            {...register('referralSource')}
            className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer bg-black text-white hover:bg-gray-800 focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
          >
            <option value="" className="bg-black text-white cursor-pointer text-sm">Pick a Referral</option>
            <option value="Facebook" className="bg-black text-white cursor-pointer text-sm hover:bg-white hover:text-black">Facebook</option>
            <option value="Google" className="bg-black text-white cursor-pointer text-sm hover:bg-white hover:text-black">Google</option>
            <option value="Instagram" className="bg-black text-white cursor-pointer text-sm hover:bg-white hover:text-black">Instagram</option>
            <option value="Friend" className="bg-black text-white cursor-pointer text-sm hover:bg-white hover:text-black">Friend</option>
            <option value="Previous Customer" className="bg-black text-white cursor-pointer text-sm hover:bg-white hover:text-black">Previous Customer</option>
            <option value="Other" className="bg-black text-white cursor-pointer text-sm hover:bg-white hover:text-black">Other</option>
          </select>
        </div>
        {renderErrorMessage(errors.referralSource)}
      </div>

      {/* Other Referral Input */}
      {showOtherInput && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-red-500" />
            <label htmlFor="other_referral" className="text-base font-medium text-black">
              Please specify *
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="other_referral"
              {...register('otherReferralSource')}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer bg-black text-white hover:bg-gray-800 focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
            />
          </div>
          {renderErrorMessage(errors.otherReferralSource)}
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
            <label htmlFor="first_name" className="text-base font-medium text-black">
              First Name *
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="first_name"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
            />
          </div>
          {renderErrorMessage(errors.name)}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
            <label htmlFor="last_name" className="text-base font-medium text-black">
              Last Name *
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="last_name"
              {...register('lastName')}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
            />
          </div>
          {renderErrorMessage(errors.lastName)}
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
            <label htmlFor="email" className="text-base font-medium text-black">
              Email *
            </label>
          </div>
          <div className="relative">
            <input
              type="email"
              id="email"
              {...register('email')}
              autoComplete="email"
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
            />
          </div>
          {renderErrorMessage(errors.email)}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Phone className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
            <label htmlFor="phone" className="text-base font-medium text-black">
              Phone *
            </label>
          </div>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              onChange={handlePhoneChange}
              placeholder="(702) 555-1234"
              maxLength={14}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
            />
          </div>
          {renderErrorMessage(errors.phone)}
        </div>
      </div>

      {/* Address Fields */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
            <label htmlFor="address" className="text-base font-medium text-black">
              Street Address *
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="address"
              {...register('address')}
              placeholder="Enter your street address"
              autoComplete="street-address"
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
            />
          </div>
          {renderErrorMessage(errors.address)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Map className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
              <label htmlFor="city" className="text-base font-medium text-black">
                City *
              </label>
            </div>
            <div className="relative">
              <select
                id="city"
                {...register('city')}
                onChange={handleCityChange}
                className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer bg-black text-white hover:bg-gray-800 focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
              >
                <option value="" className="bg-black text-white cursor-pointer text-sm">Pick a City</option>
                <option value="Las Vegas" className="bg-black text-white cursor-pointer text-sm hover:bg-white hover:text-black">Las Vegas</option>
                <option value="Henderson" className="bg-black text-white cursor-pointer text-sm hover:bg-white hover:text-black">Henderson</option>
                <option value="North Las Vegas" className="bg-black text-white cursor-pointer text-sm hover:bg-white hover:text-black">North Las Vegas</option>
                <option value="Other" className="bg-black text-white cursor-pointer text-sm hover:bg-white hover:text-black">Other</option>
              </select>
            </div>
            {renderErrorMessage(errors.city)}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hash className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
              <label htmlFor="zip" className="text-base font-medium text-black">
                ZIP Code *
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="zip"
                {...register('zip')}
                placeholder="89XXX"
                className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
              />
            </div>
            {renderErrorMessage(errors.zip)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfoForm; 