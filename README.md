# UK Civil Service Pay Scales

A comprehensive, searchable database of UK Civil Service pay scales across government departments. This project makes salary information more accessible to civil servants and jobseekers by aggregating data from Freedom of Information (FOI) requests and official publications.

## Features

- **Search & Filter**: Quickly find pay scales by department name or abbreviation
- **Hide Empty**: Toggle to show only departments with data
- **Location Toggle**: Switch between National and London pay scales
- **Year Tabs**: Browse historical pay scales from 2020 to 2026 where available
- **Compare Departments**: Side-by-side comparison of up to 3 departments
- **Contribute CTA**: Live count of departments still missing data, with guidance on how to help
- **Mobile Responsive**: Works on desktop, tablet, and mobile devices
- **Source Attribution**: Every pay scale links back to its source (FOI request or official publication)
- **Last Updated Dates**: Clear transparency about data freshness

## Live Site

[https://domlys.github.io/UK-Civil-Service-Pay/](https://domlys.github.io/UK-Civil-Service-Pay/)

## Screenshots

| Department grid | Department detail |
|---|---|
| ![Department grid](public/screenshots/Screenshot%202026-04-05%20at%2023.24.32.png) | ![Department detail](public/screenshots/Screenshot%202026-04-05%20at%2023.24.49.png) |

## Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Domlys/UK-Civil-Service-Pay.git
cd UK-Civil-Service-Pay
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Data Structure

Pay scale data is stored in `src/data/departments.json` with the following structure:

```json
{
  "departments": [
    {
      "id": "hmrc",
      "name": "HM Revenue & Customs",
      "abbreviation": "HMRC",
      "type": "ministerial",
      "lastUpdated": "2024-11-01",
      "source": "FOI Request 2024-123",
      "sourceUrl": "https://...",
      "payScales": {
        "2024": [
          {
            "grade": "Administrative Officer (AO)",
            "national": { "min": 25020, "max": 28360 },
            "london": { "min": 28020, "max": 31360 },
            "notes": ""
          }
        ]
      }
    }
  ]
}
```

Departments without data yet are included as stubs (empty `payScales` object) so they appear in the grid as targets for contribution.

## Contributing

All data on this site comes from publicly available sources. Please **only share information that is already in the public domain** — do not share anything from internal systems, unpublished documents, or internal communications.

### Finding pay data

1. Search [WhatDoTheyKnow.com](https://www.whatdotheyknow.com) for existing FOI responses — search for a department name plus "pay scales" or "pay bands"
2. Submit your own FOI request to a department asking for their current pay scales by grade
3. [Civil Service Jobs](https://www.civilservicejobs.service.gov.uk) adverts include salary ranges — a handful of listings per grade builds a reliable picture

### How to contribute

The best way to contribute is via GitHub — raise an issue or open a pull request with:
- Department name and abbreviation
- Grade names
- Min/max salary
- Whether national or London (or both)
- The year the data applies to
- Source reference (FOI URL, publication link, etc.)

### Guidelines

- Always include source references for pay scale data
- Verify data accuracy before submitting
- Update the `lastUpdated` field when modifying pay scales
- Keep commit messages clear and descriptive

## Data Sources

All data is compiled from:
- Freedom of Information (FOI) requests via [WhatDoTheyKnow](https://www.whatdotheyknow.com)
- Official government publications
- Department-published pay scales and pay offers

Data is provided under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

## Departments

The site currently includes data for the main ministerial departments, several non-ministerial departments, and the devolved governments (Scottish Government, Welsh Government, Northern Ireland Office). Many more are listed as stubs awaiting data.

Full list of departments with data: Cabinet Office, DBT, DCMS, DfE, DESNZ, Defra, DSIT, DfT, DWP, DHSC, FCDO, HMT, Home Office, MoD, MHCLG, MoJ, HMRC, NIO, SG, WG — and more being added.

## Roadmap

- [x] Historical pay scale data (2020–2026 where available)
- [ ] Extend historical data further back
- [ ] Fill remaining department stubs
- [ ] Add progression/increment information
- [ ] Export to CSV functionality
- [ ] Take-home pay calculator

## Disclaimer

This is an independent project and is **not affiliated** with the UK Civil Service or any government department.

- Pay scales may change without notice
- Always verify current salary information with the relevant department before making career decisions
- This information is provided for reference purposes only

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

The pay scale data is Crown Copyright and is reused under the Open Government Licence v3.0.

## Acknowledgments

- Civil servants and researchers who have shared publicly available pay information
- FOI officers who process requests and publish responses
- The [r/TheCivilService](https://www.reddit.com/r/TheCivilService/) community

---

*Last updated: April 2026*
