# UK Civil Service Pay Scales

A comprehensive, searchable database of UK Civil Service pay scales across government departments. This project aims to make salary information more accessible to civil servants and jobseekers by aggregating data from Freedom of Information (FOI) requests and official publications.

## 🎯 Features

- **Search & Filter**: Quickly find pay scales by department name or abbreviation
- **Location Toggle**: Switch between National and London pay scales
- **Compare Departments**: Side-by-side comparison of up to 3 departments
- **Mobile Responsive**: Works on desktop, tablet, and mobile devices
- **Source Attribution**: Every pay scale links back to its source (FOI request or official publication)
- **Last Updated Dates**: Clear transparency about data freshness

## 🚀 Live Demo

[View the live site](https://domlys.github.io/UK-Civil-Service-Pay/)

## 📸 Screenshots

*(Add screenshots here once deployed)*

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: GitHub Pages / Netlify *(update as appropriate)*

## 🏃 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/civil-service-pay-scales.git
cd civil-service-pay-scales
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

## 📊 Data Structure

Pay scale data is stored in `src/data/departments.json` with the following structure:

```json
{
  "departments": [
    {
      "id": "hmrc",
      "name": "HM Revenue & Customs",
      "abbreviation": "HMRC",
      "lastUpdated": "2024-11-01",
      "source": "FOI Request 2024-123",
      "sourceUrl": "https://...",
      "payScales": [
        {
          "grade": "Administrative Officer (AO)",
          "national": { "min": 25020, "max": 28360 },
          "london": { "min": 28020, "max": 31360 },
          "notes": ""
        }
      ]
    }
  ]
}
```

## 🔧 Data Conversion Tool

A Python script is included to help convert FOI responses (CSV/Excel) into the required JSON format.

### Setup

```bash
pip install openpyxl
```

### Usage

**Convert a CSV file:**
```bash
python foi_converter.py data.csv --dept "HM Revenue & Customs" --abbr "HMRC" --source "FOI Request 2024-123"
```

**Convert an Excel file:**
```bash
python foi_converter.py data.xlsx --dept "Ministry of Defence" --abbr "MOD"
```

**Manual entry mode:**
```bash
python foi_converter.py --manual
```

**Merge with existing data:**
```bash
python foi_converter.py new_data.csv --dept "Home Office" --abbr "HO" --merge
```

See the script's help for more options:
```bash
python foi_converter.py --help
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Adding New Department Data

1. Fork the repository
2. Add your department data to `src/data/departments.json` (or use the converter script)
3. Ensure the data includes:
   - Accurate pay scales
   - Source attribution (FOI reference or official publication)
   - Last updated date
4. Submit a pull request

### Reporting Issues

- Found incorrect data? [Open an issue](../../issues)
- Have a feature request? [Open an issue](../../issues)
- Spotted a bug? [Open an issue](../../issues)

### Guidelines

- Always include source references for pay scale data
- Verify data accuracy before submitting
- Update the `lastUpdated` field when modifying pay scales
- Keep commit messages clear and descriptive

## 📋 Data Sources

All data is compiled from:
- Freedom of Information (FOI) requests
- Official government publications
- Department-published pay scales

Data is provided under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

## 📅 Departments Currently Included

- HM Revenue & Customs (HMRC)
- Department for Work and Pensions (DWP)
- Ministry of Defence (MOD)
- *(List will grow as more departments are added)*

Want to see a department added? [Request it here](../../issues) or submit the data yourself!

## ⚠️ Disclaimer

This is an independent project and is **not affiliated** with the UK Civil Service or any government department.

- Pay scales may change without notice
- Always verify current salary information with the relevant department before making career decisions
- This information is provided for reference purposes only
- The maintainers are not responsible for any decisions made based on this data

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The data itself is Crown Copyright and is reused under the Open Government Licence v3.0.

## 🙏 Acknowledgments

- All civil servants who have shared pay information
- FOI officers who process requests
- The r/TheCivilService community on Reddit for highlighting the need for this resource

## 📞 Contact

- **Issues/Bugs**: [GitHub Issues](../../issues)
- **Feature Requests**: [GitHub Issues](../../issues)
- **General Questions**: [GitHub Discussions](../../discussions)

## 🗺️ Roadmap

- [ ] Add historical pay scale data
- [ ] Include progression information
- [ ] Add take-home pay calculator
- [ ] Mobile app version
- [ ] API for developers
- [ ] Export to CSV/PDF functionality
- [ ] Email notifications for updates

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/civil-service-pay-scales?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/civil-service-pay-scales?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/civil-service-pay-scales?style=social)

---

**Built with ❤️ for the UK Civil Service community**

*Last updated: November 2024*
