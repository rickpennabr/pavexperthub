'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UseFormRegister, FieldErrors, FieldValues, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Map, Hash, Link, ChevronDown } from 'lucide-react';

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
  const [referralOpen, setReferralOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const referralRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const referralOptions = [
    'Facebook',
    'Google',
    'Instagram',
    'Friend',
    'Previous Customer',
    'Other'
  ];

  const cityOptions = [
    'Las Vegas',
    'Henderson',
    'North Las Vegas',
    'Other'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (referralRef.current && !referralRef.current.contains(event.target as Node)) {
        setReferralOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setCityOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="relative" ref={referralRef}>
          <button
            type="button"
            className={`flex items-center justify-between w-full rounded-md border-2 shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-10 py-3 cursor-pointer transition-colors duration-200 text-[16px]
              ${selectedReferral ? 'bg-black text-white border-black' : 'border-red-500 hover:border-red-600 bg-white text-black'}`}
            onClick={() => setReferralOpen(!referralOpen)}
          >
            <span className="font-bold">
              {selectedReferral || 'Pick a Referral'}
            </span>
            <ChevronDown className={`ml-1 md:ml-2 h-4 w-4 flex-shrink-0 transition-transform ${referralOpen ? 'rotate-180' : ''} ${selectedReferral ? 'text-white' : 'text-gray-500'}`} />
          </button>
          {referralOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border-2 border-red-500 rounded-md shadow-lg">
              <div className="py-1">
                {referralOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`block w-full text-left px-4 py-3 text-[16px] text-gray-700 hover:bg-red-50 hover:border-l-4 hover:border-red-500 hover:font-bold transition-all cursor-pointer
                      ${selectedReferral === option ? 'bg-black text-white font-bold' : ''}`}
                    onClick={() => {
                      setSelectedReferral(option);
                      setReferralOpen(false);
                      const event = { target: { value: option } } as React.ChangeEvent<HTMLSelectElement>;
                      register('referralSource').onChange(event);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
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
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-3 cursor-pointer bg-black text-white hover:bg-gray-800 focus:bg-black focus:text-white transition-colors duration-200 text-[16px]"
            />
          </div>
          {renderErrorMessage(errors.otherReferralSource)}
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-red-500" />
            <label htmlFor="first_name" className="text-base font-medium text-black">
              First Name *
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="first_name"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-3 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 text-[16px]"
            />
          </div>
          {renderErrorMessage(errors.name)}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-red-500" />
            <label htmlFor="last_name" className="text-base font-medium text-black">
              Last Name *
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="last_name"
              {...register('lastName')}
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-3 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 text-[16px]"
            />
          </div>
          {renderErrorMessage(errors.lastName)}
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-5 w-5 text-red-500" />
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
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-3 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 text-[16px]"
            />
          </div>
          {renderErrorMessage(errors.email)}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Phone className="h-5 w-5 text-red-500" />
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
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-3 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 text-[16px]"
            />
          </div>
          {renderErrorMessage(errors.phone)}
        </div>
      </div>

      {/* Address Fields */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-red-500" />
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
              className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-3 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 text-[16px]"
            />
          </div>
          {renderErrorMessage(errors.address)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Map className="h-5 w-5 text-red-500" />
              <label htmlFor="city" className="text-base font-medium text-black">
                City *
              </label>
            </div>
            <div className="relative" ref={cityRef}>
              <button
                type="button"
                className={`flex items-center justify-between w-full rounded-md border-2 shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-10 py-3 cursor-pointer transition-colors duration-200 text-[16px]
                  ${selectedCity ? 'bg-black text-white border-black' : 'border-red-500 hover:border-red-600 bg-white text-black'}`}
                onClick={() => setCityOpen(!cityOpen)}
              >
                <span className="font-bold">
                  {selectedCity || 'Pick a City'}
                </span>
                <ChevronDown className={`ml-1 md:ml-2 h-4 w-4 flex-shrink-0 transition-transform ${cityOpen ? 'rotate-180' : ''} ${selectedCity ? 'text-white' : 'text-gray-500'}`} />
              </button>
              {cityOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border-2 border-red-500 rounded-md shadow-lg">
                  <div className="py-1">
                    {cityOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`block w-full text-left px-4 py-3 text-[16px] text-gray-700 hover:bg-red-50 hover:border-l-4 hover:border-red-500 hover:font-bold transition-all cursor-pointer
                          ${selectedCity === option ? 'bg-black text-white font-bold' : ''}`}
                        onClick={() => {
                          setSelectedCity(option);
                          setCityOpen(false);
                          const event = { target: { value: option } } as React.ChangeEvent<HTMLSelectElement>;
                          handleCityChange(event);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {renderErrorMessage(errors.city)}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hash className="h-5 w-5 text-red-500" />
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
                className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-3 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 text-[16px]"
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