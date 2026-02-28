#!/usr/bin/env node
/**
 * convert-csv.js
 *
 * Converts a CSV spreadsheet export into the departments.json format
 * used by the UK Civil Service Pay Scales website.
 *
 * Usage:
 *   node scripts/convert-csv.js [input.csv] [output.json]
 *
 * Defaults:
 *   input  = data.csv          (in the project root)
 *   output = src/data/departments.json
 *
 * CSV format (one row per grade per department):
 *   department_id, department_name, abbreviation, last_updated, source,
 *   source_url, grade, national_min, national_max, london_min, london_max, notes
 *
 * Rules:
 *   - The first row is a header and is skipped.
 *   - Department metadata columns are repeated on every row for that dept;
 *     the script de-duplicates by department_id.
 *   - Leave london_min / london_max blank for departments with no London pay
 *     (e.g. Scottish/Welsh Government). The 'london' key is omitted from the JSON.
 *   - Numeric columns must be plain integers (no £ symbol, no commas).
 *   - last_updated must be in ISO 8601 format (YYYY-MM-DD).
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputPath  = process.argv[2] ?? resolve(__dirname, '../data.csv');
const outputPath = process.argv[3] ?? resolve(__dirname, '../src/data/departments.json');

if (!existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  console.error('Create a data.csv file in the project root, or pass the path as the first argument.');
  process.exit(1);
}

const raw = readFileSync(inputPath, 'utf8');
const lines = raw.split('\n').map(l => l.trimEnd()).filter(Boolean);

if (lines.length < 2) {
  console.error('Error: CSV file must have a header row and at least one data row.');
  process.exit(1);
}

/**
 * Parse a single CSV line, respecting double-quoted fields.
 * Handles fields that contain commas or quotes (escaped as "").
 */
function parseLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote inside a quoted field
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  result.push(current.trim());
  return result;
}

const headers = parseLine(lines[0]).map(h => h.trim());
const deptMap = new Map(); // Preserves insertion order

let rowsProcessed = 0;
let errors = 0;

for (let i = 1; i < lines.length; i++) {
  const cols = parseLine(lines[i]);
  const row = Object.fromEntries(headers.map((h, idx) => [h, cols[idx] ?? '']));

  const id = row.department_id?.trim();
  if (!id) continue; // Skip blank rows

  // Validate required fields
  const requiredFields = ['department_name', 'abbreviation', 'last_updated', 'grade', 'national_min', 'national_max'];
  const missing = requiredFields.filter(f => !row[f]);
  if (missing.length > 0) {
    console.warn(`Row ${i + 1}: Missing required fields: ${missing.join(', ')} — skipping`);
    errors++;
    continue;
  }

  if (!deptMap.has(id)) {
    deptMap.set(id, {
      id,
      name: row.department_name,
      abbreviation: row.abbreviation,
      lastUpdated: row.last_updated,
      source: row.source ?? '',
      sourceUrl: row.source_url ?? '',
      payScales: []
    });
  }

  const dept = deptMap.get(id);

  const nationalMin = parseInt(row.national_min, 10);
  const nationalMax = parseInt(row.national_max, 10);

  if (isNaN(nationalMin) || isNaN(nationalMax)) {
    console.warn(`Row ${i + 1}: Invalid national salary values for ${id}/${row.grade} — skipping`);
    errors++;
    continue;
  }

  const scale = {
    grade: row.grade,
    national: { min: nationalMin, max: nationalMax },
    notes: row.notes ?? ''
  };

  // Only add london key when both values are present and valid
  const londonMin = parseInt(row.london_min, 10);
  const londonMax = parseInt(row.london_max, 10);
  if (row.london_min?.trim() !== '' && row.london_max?.trim() !== '' && !isNaN(londonMin) && !isNaN(londonMax)) {
    scale.london = { min: londonMin, max: londonMax };
  }

  dept.payScales.push(scale);
  rowsProcessed++;
}

if (deptMap.size === 0) {
  console.error('Error: No valid departments found in CSV. Check the file format and column headers.');
  process.exit(1);
}

const output = { departments: Array.from(deptMap.values()) };
const json = JSON.stringify(output, null, 2);

writeFileSync(outputPath, json, 'utf8');

console.log(`Done: ${deptMap.size} departments, ${rowsProcessed} pay scale rows → ${outputPath}`);
if (errors > 0) {
  console.warn(`${errors} rows had errors and were skipped. Review the warnings above.`);
}
