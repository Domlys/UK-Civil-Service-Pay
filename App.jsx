import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ExternalLink, Calendar, Building2, Info } from 'lucide-react';

// Sample data structure - you'll replace this with your actual data
const sampleData = {
  departments: [
    {
      id: "hmrc",
      name: "HM Revenue & Customs",
      abbreviation: "HMRC",
      lastUpdated: "2024-11-01",
      source: "Published Pay Scales 2024",
      sourceUrl: "https://www.gov.uk/government/organisations/hm-revenue-customs",
      payScales: [
        {
          grade: "Administrative Assistant (AA)",
          national: { min: 23270, max: 24320 },
          london: { min: 26270, max: 27320 },
          notes: "Entry level position"
        },
        {
          grade: "Administrative Officer (AO)",
          national: { min: 25020, max: 28360 },
          london: { min: 28020, max: 31360 },
          notes: ""
        },
        {
          grade: "Executive Officer (EO)",
          national: { min: 29300, max: 34610 },
          london: { min: 32300, max: 37610 },
          notes: ""
        },
        {
          grade: "Higher Executive Officer (HEO)",
          national: { min: 36490, max: 43450 },
          london: { min: 39490, max: 46450 },
          notes: ""
        },
        {
          grade: "Senior Executive Officer (SEO)",
          national: { min: 46340, max: 53590 },
          london: { min: 49340, max: 56590 },
          notes: ""
        },
        {
          grade: "Grade 7",
          national: { min: 58570, max: 70930 },
          london: { min: 61570, max: 73930 },
          notes: ""
        }
      ]
    },
    {
      id: "dwp",
      name: "Department for Work and Pensions",
      abbreviation: "DWP",
      lastUpdated: "2024-10-15",
      source: "FOI Response 2024-456",
      sourceUrl: "#",
      payScales: [
        {
          grade: "Administrative Assistant (AA)",
          national: { min: 23180, max: 24230 },
          london: { min: 26180, max: 27230 },
          notes: ""
        },
        {
          grade: "Administrative Officer (AO)",
          national: { min: 24920, max: 28260 },
          london: { min: 27920, max: 31260 },
          notes: ""
        },
        {
          grade: "Executive Officer (EO)",
          national: { min: 29100, max: 34410 },
          london: { min: 32100, max: 37410 },
          notes: ""
        },
        {
          grade: "Higher Executive Officer (HEO)",
          national: { min: 36290, max: 43250 },
          london: { min: 39290, max: 46250 },
          notes: ""
        },
        {
          grade: "Senior Executive Officer (SEO)",
          national: { min: 46140, max: 53390 },
          london: { min: 49140, max: 56390 },
          notes: ""
        }
      ]
    },
    {
      id: "mod",
      name: "Ministry of Defence",
      abbreviation: "MOD",
      lastUpdated: "2024-09-30",
      source: "Published Salary Information",
      sourceUrl: "#",
      payScales: [
        {
          grade: "Administrative Assistant (AA)",
          national: { min: 23500, max: 24550 },
          london: { min: 26500, max: 27550 },
          notes: ""
        },
        {
          grade: "Administrative Officer (AO)",
          national: { min: 25240, max: 28580 },
          london: { min: 28240, max: 31580 },
          notes: ""
        },
        {
          grade: "Executive Officer (EO)",
          national: { min: 29520, max: 34830 },
          london: { min: 32520, max: 37830 },
          notes: ""
        },
        {
          grade: "Higher Executive Officer (HEO)",
          national: { min: 36710, max: 43670 },
          london: { min: 39710, max: 46670 },
          notes: ""
        },
        {
          grade: "Senior Executive Officer (SEO)",
          national: { min: 46560, max: 53810 },
          london: { min: 49560, max: 56810 },
          notes: ""
        },
        {
          grade: "Grade 7",
          national: { min: 58790, max: 71150 },
          london: { min: 61790, max: 74150 },
          notes: ""
        }
      ]
    }
  ]
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [locationFilter, setLocationFilter] = useState('national');

  const filteredDepartments = useMemo(() => {
    return sampleData.departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeptSelect = (dept) => {
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

  // Get all unique grades across selected departments for comparison
  const getUniqueGrades = () => {
    const gradesSet = new Set();
    selectedDepts.forEach(dept => {
      dept.payScales.forEach(scale => gradesSet.add(scale.grade));
    });
    return Array.from(gradesSet);
  };

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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Important Information</p>
            <p>Pay scales are compiled from FOI requests and published sources. Always verify with the relevant department. Last site update: November 2024.</p>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Departments
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
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

        {/* Department List or Single View */}
        {!compareMode && !selectedDept && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map(dept => (
              <button
                key={dept.id}
                onClick={() => handleDeptSelect(dept)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.abbreviation}</h3>
                <p className="text-sm text-gray-600 mb-4">{dept.name}</p>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <Calendar size={14} />
                  Updated: {formatDate(dept.lastUpdated)}
                </div>
              </button>
            ))}
          </div>
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
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDept.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedDept.abbreviation}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Calendar size={14} />
                    {formatDate(selectedDept.lastUpdated)}
                  </div>
                  <a
                    href={selectedDept.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 justify-end"
                  >
                    View Source <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Minimum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Maximum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedDept.payScales.map((scale, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {scale.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {formatCurrency(scale[locationFilter].min)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {formatCurrency(scale[locationFilter].max)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {scale.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Compare Mode - Department Selection */}
        {compareMode && selectedDepts.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map(dept => (
              <button
                key={dept.id}
                onClick={() => handleDeptSelect(dept)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.abbreviation}</h3>
                <p className="text-sm text-gray-600 mb-4">{dept.name}</p>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <Calendar size={14} />
                  Updated: {formatDate(dept.lastUpdated)}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Compare Mode - Selection in Progress */}
        {compareMode && selectedDepts.length > 0 && selectedDepts.length < 2 && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Selected Departments:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDepts.map(dept => (
                  <span
                    key={dept.id}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {dept.abbreviation}
                    <button
                      onClick={() => setSelectedDepts(selectedDepts.filter(d => d.id !== dept.id))}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">Select at least one more department to compare</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDepartments
                .filter(dept => !selectedDepts.find(d => d.id === dept.id))
                .map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => handleDeptSelect(dept)}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.abbreviation}</h3>
                    <p className="text-sm text-gray-600 mb-4">{dept.name}</p>
                    <div className="flex items-center text-xs text-gray-500 gap-2">
                      <Calendar size={14} />
                      Updated: {formatDate(dept.lastUpdated)}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {compareMode && selectedDepts.length >= 2 && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Comparing:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDepts.map(dept => (
                      <span
                        key={dept.id}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {dept.abbreviation}
                        <button
                          onClick={() => setSelectedDepts(selectedDepts.filter(d => d.id !== dept.id))}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                {selectedDepts.length < 3 && (
                  <button
                    onClick={() => setCompareMode(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Department
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                      Grade
                    </th>
                    {selectedDepts.map(dept => (
                      <th key={dept.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="2">
                        {dept.abbreviation}
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-400 sticky left-0 bg-gray-50"></th>
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
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 sticky left-0 bg-white">
                        {grade}
                      </td>
                      {selectedDepts.map(dept => {
                        const scale = dept.payScales.find(s => s.grade === grade);
                        return (
                          <React.Fragment key={dept.id}>
                            <td className="px-3 py-4 whitespace-nowrap text-center text-gray-700">
                              {scale ? formatCurrency(scale[locationFilter].min) : '-'}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-center text-gray-700">
                              {scale ? formatCurrency(scale[locationFilter].max) : '-'}
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
              Found an error? Want to contribute? Contact via GitHub.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;