import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ExternalLink, Calendar, Building2, Info, Github } from 'lucide-react';
import departmentsData from './data/departments.json';

const ALL_YEARS = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

const sampleData = departmentsData;

const lastDataUpdate = new Date(
  Math.max(...sampleData.departments
    .filter(d => d.lastUpdated)
    .map(d => new Date(d.lastUpdated)))
).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [locationFilter, setLocationFilter] = useState('national');
  const [yearFilter, setYearFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [hideEmpty, setHideEmpty] = useState(false);

  const hasData = (dept) => Object.keys(dept.payScales).length > 0;

  const getAvailableYears = (dept) => Object.keys(dept.payScales).sort();

  const getEffectiveYear = (dept) => {
    const years = getAvailableYears(dept);
    if (!years.length) return null;
    return years.includes(yearFilter) ? yearFilter : years.at(-1);
  };

  const getPayScalesForDept = (dept) => {
    const year = getEffectiveYear(dept);
    return year ? dept.payScales[year] : [];
  };

  const filteredDepartments = useMemo(() => {
    return sampleData.departments.filter(dept => {
      const matchesSearch =
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.abbreviation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'ministerial' && dept.type === 'ministerial') ||
        (typeFilter === 'non-ministerial' && dept.type === 'non-ministerial') ||
        (typeFilter === 'devolved' && dept.type === 'devolved') ||
        (typeFilter === 'has-data' && hasData(dept));
      const matchesEmpty = !hideEmpty || hasData(dept);
      return matchesSearch && matchesType && matchesEmpty;
    });
  }, [searchTerm, typeFilter, hideEmpty]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No data yet';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long'
    });
  };

  const handleDeptSelect = (dept) => {
    if (!hasData(dept)) return;
    if (compareMode) {
      if (selectedDepts.find(d => d.id === dept.id)) {
        setSelectedDepts(selectedDepts.filter(d => d.id !== dept.id));
      } else if (selectedDepts.length < 3) {
        setSelectedDepts([...selectedDepts, dept]);
      }
    } else {
      setSelectedDept(dept);
    }
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setSelectedDepts([]);
    setSelectedDept(null);
  };

  const getUniqueGrades = () => {
    const gradesSet = new Set();
    selectedDepts.forEach(dept => {
      getPayScalesForDept(dept).forEach(scale => gradesSet.add(scale.grade));
    });
    return Array.from(gradesSet);
  };

  const typeLabel = (type) => {
    if (type === 'non-ministerial') return 'Non-ministerial';
    if (type === 'devolved') return 'Devolved';
    return null;
  };

  const DeptCard = ({ dept }) => {
    const active = hasData(dept);
    const isSelected = compareMode && selectedDepts.find(d => d.id === dept.id);
    const label = typeLabel(dept.type);

    return (
      <button
        onClick={() => handleDeptSelect(dept)}
        disabled={!active}
        className={`rounded-lg shadow-md p-5 text-left w-full transition-all ${
          !active
            ? 'bg-gray-50 opacity-50 cursor-not-allowed'
            : isSelected
            ? 'bg-blue-50 border-2 border-blue-500 shadow-lg'
            : 'bg-white hover:shadow-lg cursor-pointer'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={`text-lg font-bold leading-tight ${active ? 'text-gray-900' : 'text-gray-500'}`}>
            {dept.abbreviation}
          </h3>
          {label && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 whitespace-nowrap flex-shrink-0">
              {label}
            </span>
          )}
        </div>
        <p className={`text-sm mb-3 leading-tight ${active ? 'text-gray-600' : 'text-gray-400'}`}>
          {dept.name}
        </p>
        {active ? (
          <div className="flex items-center text-xs text-gray-400 gap-1">
            <Calendar size={12} />
            <span>Updated {formatDate(dept.lastUpdated)}</span>
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic">No data yet - help us add this</div>
        )}
        {active && (
          <div className="mt-2 flex flex-wrap gap-1">
            {getAvailableYears(dept).map(y => (
              <span key={y} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                {y}
              </span>
            ))}
          </div>
        )}
      </button>
    );
  };

  const DeptGrid = ({ depts }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {depts.map(dept => <DeptCard key={dept.id} dept={dept} />)}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">UK Civil Service Pay Scales</h1>
              <p className="mt-2 text-blue-200">Compare salary scales across government departments</p>
            </div>
            <Building2 size={48} className="text-blue-300" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Important Information</p>
            <p>
              Pay scales are compiled from FOI requests and published sources. Always verify with the
              relevant department. Last data update: {lastDataUpdate}.{' '}
              <span className="text-gray-500">
                Faded departments are on our list but we don't have data for them yet - see below to contribute.
              </span>
            </p>
          </div>
        </div>

        {/* Contribute CTA */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-green-900">
            <strong>{sampleData.departments.filter(d => !hasData(d)).length} departments</strong> are still missing data — if you've found published pay scales we haven't added yet, help us fill them in.
          </p>
          <a href="#contribute" className="flex-shrink-0 text-sm font-medium text-green-700 hover:text-green-900 underline">
            How to contribute ↓
          </a>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search departments</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or abbreviation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All departments</option>
                <option value="ministerial">Ministerial</option>
                <option value="non-ministerial">Non-ministerial</option>
                <option value="devolved">Devolved</option>
                <option value="has-data">Has data</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="national">National</option>
                <option value="london">London</option>
              </select>
            </div>

            <button
              onClick={() => setHideEmpty(!hideEmpty)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                hideEmpty
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {hideEmpty ? 'Showing data only' : 'Hide empty'}
            </button>

            <button
              onClick={toggleCompareMode}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                compareMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowUpDown size={18} />
              {compareMode ? 'Exit Compare' : 'Compare Mode'}
            </button>
          </div>

          {compareMode && (
            <div className="mt-4 text-sm text-gray-600">
              Selected for comparison: {selectedDepts.length}/3 departments
            </div>
          )}
        </div>

        {/* Department List - default view */}
        {!compareMode && !selectedDept && (
          <DeptGrid depts={filteredDepartments} />
        )}

        {/* Single Department View */}
        {!compareMode && selectedDept && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <button
                onClick={() => setSelectedDept(null)}
                className="text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
              >
                ← Back to all departments
              </button>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDept.name}</h2>
                  <p className="text-gray-500 mt-1 text-sm">{selectedDept.abbreviation}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Calendar size={14} />
                    {formatDate(selectedDept.lastUpdated)}
                  </div>
                  {selectedDept.sourceUrl && (
                    <a
                      href={selectedDept.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 justify-end"
                    >
                      View Source <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Year tabs - all years 2020-2026, greyed out if no data */}
            <div className="px-6 pt-4 flex gap-1 border-b border-gray-200 overflow-x-auto">
              {ALL_YEARS.map(year => {
                const available = getAvailableYears(selectedDept).includes(year);
                const active = getEffectiveYear(selectedDept) === year;
                return (
                  <button
                    key={year}
                    onClick={() => available && setYearFilter(year)}
                    disabled={!available}
                    title={!available ? 'No data available for this year' : undefined}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 -mb-px transition-colors whitespace-nowrap ${
                      !available
                        ? 'border-transparent text-gray-300 cursor-not-allowed'
                        : active
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maximum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPayScalesForDept(selectedDept).map((scale, idx) => {
                    const salaryData = scale[locationFilter] ?? scale.national;
                    const isNationalFallback = locationFilter === 'london' && !scale[locationFilter];
                    if (!salaryData) return null;
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{scale.grade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {formatCurrency(salaryData.min)}{isNationalFallback ? ' *' : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {formatCurrency(salaryData.max)}{isNationalFallback ? ' *' : ''}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{scale.notes || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {locationFilter === 'london' && getPayScalesForDept(selectedDept).some(s => !s.london) && (
              <p className="px-6 py-3 text-xs text-gray-500">* London pay not separately published for this department; national rate shown.</p>
            )}
          </div>
        )}

        {/* Compare Mode - department selection */}
        {compareMode && selectedDepts.length === 0 && (
          <DeptGrid depts={filteredDepartments} />
        )}

        {compareMode && selectedDepts.length > 0 && selectedDepts.length < 2 && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Selected Departments:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDepts.map(dept => (
                  <span key={dept.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    {dept.abbreviation}
                    <button onClick={() => setSelectedDepts(selectedDepts.filter(d => d.id !== dept.id))} className="hover:text-blue-900">×</button>
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">Select at least one more department to compare</p>
            </div>
            <DeptGrid depts={filteredDepartments.filter(dept => !selectedDepts.find(d => d.id === dept.id))} />
          </div>
        )}

        {/* Comparison Table */}
        {compareMode && selectedDepts.length >= 2 && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Comparing:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDepts.map(dept => (
                      <span key={dept.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        {dept.abbreviation}
                        <button onClick={() => setSelectedDepts(selectedDepts.filter(d => d.id !== dept.id))} className="hover:text-blue-900">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">Grade</th>
                    {selectedDepts.map(dept => (
                      <th key={dept.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="2">
                        {dept.abbreviation}
                        <span className="block text-gray-400 font-normal normal-case text-xs mt-0.5">{getEffectiveYear(dept)} data</span>
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <th className="px-6 py-2 sticky left-0 bg-gray-50"></th>
                    {selectedDepts.map(dept => (
                      <React.Fragment key={dept.id}>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-400">Min</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-400">Max</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getUniqueGrades().map((grade, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 sticky left-0 bg-white">{grade}</td>
                      {selectedDepts.map(dept => {
                        const scale = getPayScalesForDept(dept).find(s => s.grade === grade);
                        const salaryData = scale ? (scale[locationFilter] ?? scale.national) : null;
                        const isNationalFallback = scale && locationFilter === 'london' && !scale[locationFilter];
                        return (
                          <React.Fragment key={dept.id}>
                            <td className="px-3 py-4 whitespace-nowrap text-center text-gray-700">
                              {salaryData ? formatCurrency(salaryData.min) + (isNationalFallback ? ' *' : '') : '-'}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-center text-gray-700">
                              {salaryData ? formatCurrency(salaryData.max) + (isNationalFallback ? ' *' : '') : '-'}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contribute Section */}
        <div id="contribute" className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Help us fill in the gaps</h2>
          <p className="text-sm text-gray-600 mb-6">
            Many departments are listed but have no data yet. All the data on this site comes from publicly available sources — if you've found something we're missing, we'd love to hear about it.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Where to look</h3>
              <ol className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">1</span>
                  <span>
                    Search{' '}
                    <a href="https://www.whatdotheyknow.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">WhatDoTheyKnow.com</a>
                    {' '}for existing FOI responses — many departments have already had pay scale requests published there.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">2</span>
                  <span>Submit your own FOI request to a department asking for their current pay scales by grade. Responses become public on WhatDoTheyKnow.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">3</span>
                  <span>
                    <a href="https://www.civilservicejobs.service.gov.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Civil Service Jobs</a>
                    {' '}adverts include salary ranges — a handful of listings per grade can build a reliable picture.
                  </span>
                </li>
              </ol>
              <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>Please only share information that is already publicly available.</strong> Do not share anything from internal systems, unpublished documents, or internal communications — even if you think it may be in the public interest.
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">How to contribute</h3>
              <p className="text-sm text-gray-600 mb-4">
                The best way to contribute is directly via GitHub. Raise an issue or open a pull request with the grade, min/max salary, whether it's national or London, and the year.
              </p>
              <a
                href="https://github.com/domlys/UK-Civil-Service-Pay"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Github size={16} />
                Contribute on GitHub
              </a>
              <p className="text-sm text-gray-500 mt-4">
                You can also post in the{' '}
                <a href="https://www.reddit.com/r/TheCivilService/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">r/TheCivilService</a>
                {' '}subreddit or in any active thread about this project.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-sm">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This is an independent project and is not affiliated with the UK Civil Service or any government department.
              All data is compiled from publicly available sources including FOI requests and official publications.
            </p>
            <p className="mb-2">
              Pay scales may change. Always verify current salary information with the relevant department before making career decisions.
            </p>
            <p className="text-gray-400 text-xs mt-4">
              Data is provided under the Open Government Licence v3.0.
              Found an error? Want to contribute?{' '}
              <a href="https://github.com/domlys/UK-Civil-Service-Pay" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Contribute on GitHub
              </a>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
