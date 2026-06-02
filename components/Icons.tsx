// Airplane Icon
export const AirplaneIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" className={className}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M38.2238 21.0003c-0.3187 0 -1.3865 0.0093 -1.6875 0.0281l-6.0844 0.1594c-0.0317 0.0019 -0.0632 -0.0049 -0.0911 -0.0198 -0.028 -0.0149 -0.0513 -0.0373 -0.0673 -0.0646L18.1454 6.33399c-0.0737 -0.09753 -0.1678 -0.1779 -0.2756 -0.23552 -0.1078 -0.05763 -0.2269 -0.09115 -0.3488 -0.09823H15L21.8438 21.094c0.0163 0.0346 0.0233 0.0728 0.0204 0.1108 -0.0029 0.0382 -0.0156 0.0748 -0.037 0.1065 -0.0214 0.0317 -0.0506 0.0573 -0.0848 0.0743 -0.0343 0.0169 -0.0723 0.0246 -0.1105 0.0225l-11.4084 0.1687c-0.1188 0.0036 -0.23665 -0.0208 -0.34419 -0.0713 -0.10753 -0.0505 -0.20156 -0.1256 -0.27459 -0.2193l-3.46878 -4.2188c-0.28125 -0.3656 -0.80813 -0.5625 -1.26657 -0.5625H3.10125c-0.12094 0 -0.10313 0.1135 -0.07032 0.2279l1.86001 6.6956c0.14059 0.3586 0.14059 0.757 0 1.1156l-1.86188 6.675c-0.05531 0.1828 -0.04875 0.2813 0.16594 0.2813h1.68c0.76312 0 0.86719 -0.0994 1.25719 -0.5906l3.53441 -4.2844c0.07368 -0.0929 0.1679 -0.1676 0.27525 -0.218s0.22495 -0.0753 0.34345 -0.0727l11.3138 0.2532c0.0412 0.0009 0.0815 0.0119 0.1175 0.0319 0.036 0.0201 0.0665 0.0487 0.0889 0.0832 0.0225 0.0346 0.0362 0.0741 0.0399 0.1151 0.0037 0.0411 -0.0026 0.0823 -0.0185 0.1204L15 42.0003h2.4975c0.1218 -0.0071 0.2406 -0.0405 0.3482 -0.098 0.1077 -0.0574 0.2016 -0.1376 0.2753 -0.2348l12.1734 -14.761c0.0366 -0.0562 0.1875 -0.0844 0.2522 -0.0844l5.9907 0.1594c0.3093 0.0188 1.3678 0.0281 1.6875 0.0281 4.1503 0 6.7753 -1.1409 6.7753 -3.0093 0 -1.8685 -2.6138 -3 -6.7763 -3Z" strokeWidth="2.5" />
  </svg>
);

// Location Icon
export const LocationIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

// Calendar Icon
export const CalendarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

// Email Icon
export const EmailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

// User Icon
export const UserIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

// Ticket Icon
export const TicketIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
  </svg>
);

// Arrow Right Icon
export const ArrowRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

// Close Icon
export const CloseIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

// Check Icon
export const CheckIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
