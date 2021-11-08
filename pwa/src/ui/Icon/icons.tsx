import React from 'react';

export interface IconData {
  viewBox: string;
  vector: React.ReactNode;
}

export enum IconName {
  Person = 'person',
  Search = 'search',
  Download = 'download',
  NewPurchase = 'newPurchase',
  AddField = 'addField',
}

export interface Icons {
  [icon: string]: IconData;
}

export const icons: Icons = {
  [IconName.Person]: {
    viewBox: '0 0 26 26',
    vector: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 .5C6.1.5.5 6.1.5 13S6.1 25.5 13 25.5 25.5 19.9 25.5 13 19.9.5 13 .5zM6.838 20.85c.537-1.125 3.812-2.225 6.162-2.225s5.638 1.1 6.163 2.225A9.866 9.866 0 0113 23c-2.325 0-4.462-.8-6.162-2.15zM13 16.125c1.825 0 6.163.738 7.95 2.913A9.937 9.937 0 0023 13c0-5.513-4.488-10-10-10S3 7.487 3 13c0 2.275.775 4.363 2.05 6.038 1.788-2.175 6.125-2.913 7.95-2.913zM13 5.5a4.364 4.364 0 00-4.375 4.375A4.364 4.364 0 0013 14.25a4.364 4.364 0 004.375-4.375A4.364 4.364 0 0013 5.5zm-1.875 4.375c0 1.037.838 1.875 1.875 1.875a1.872 1.872 0 001.875-1.875A1.872 1.872 0 0013 8a1.872 1.872 0 00-1.875 1.875z"
      />
    ),
  },
  [IconName.Search]: {
    viewBox: '0 0 12 12',
    vector: (
      <path
        fill="#ffff"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.977 7.503h.527l3.326 3.334-.993.993-3.333-3.327v-.526l-.18-.187a4.314 4.314 0 01-2.82 1.047 4.333 4.333 0 114.333-4.334c0 1.074-.393 2.06-1.047 2.82l.187.18zm-6.474-3c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"
      />
    ),
  },
  [IconName.Download]: {
    viewBox: '0 0 14 18',
    vector: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 6.5h-4v-6H4v6H0l7 7 7-7zm-8 2v-6h2v6h1.17L7 10.67 4.83 8.5H6zm8 9v-2H0v2h14z"
        fill="#000"
      />
    ),
  },
  [IconName.NewPurchase]: {
    viewBox: '0 0 20 26',
    vector: (
      <path
        d="M10 15.5v-3.75H7.5v3.75H3.75V18H7.5v3.75H10V18h3.75v-2.5H10zm2.5-15h-10A2.5 2.5 0 000 3v20a2.5 2.5 0 002.5 2.5h15A2.5 2.5 0 0020 23V8L12.5.5zm5 22.5h-15V3h8.75v6.25h6.25"
        fill="#000"
      />
    ),
  },
  [IconName.AddField]: {
    viewBox: '0 0 20 20',
    vector: (
      <svg fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.667 3a.952.952 0 00-.953.952v4.762H3.952a.952.952 0 100 1.905h4.762v4.762a.952.952 0 001.905 0v-4.762h4.762a.952.952 0 000-1.905h-4.762V3.952A.952.952 0 009.667 3z"
          fill="#000"
        />
        <path
          d="M2 2h16v-4H2v4zm16 0v16h4V2h-4zm0 16H2v4h16v-4zM2 18V2h-4v16h4zm0 0h-4a4 4 0 004 4v-4zm16 0v4a4 4 0 004-4h-4zm0-16h4a4 4 0 00-4-4v4zM2-2a4 4 0 00-4 4h4v-4z"
          fill="#000"
        />
      </svg>
    ),
  },
};
