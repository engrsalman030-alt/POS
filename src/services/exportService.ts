/**
 * ExportService - Universal export utility for all reports
 * Supports: CSV and Excel-compatible (XLS) formats
 */
export interface ExportColumn {
  key: string;
  label: string;
  format?: 'currency' | 'number' | 'date' | 'text';
}

export const ExportService = {
  toCSV(
    columns: ExportColumn[],
    rows: Record<string, any>[],
    filename: string,
    summary?: Record<string, any>
  ) {
    const fmt = (val: any, format?: string): string => {
      if (val === null || val === undefined) return '';
      if (format === 'currency' || format === 'number') return Number(val).toFixed(2);
      return String(val).replace(/"/g, '""');
    };

    const header = columns.map(c => `"${c.label}"`).join(',');
    const body = rows
      .map(row => columns.map(c => `"${fmt(row[c.key], c.format)}"`).join(','))
      .join('\n');

    let csv = `${header}\n${body}`;

    if (summary && Object.keys(summary).length > 0) {
      csv += '\n\n"Summary"';
      for (const [key, value] of Object.entries(summary)) {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        csv += `\n"${label}","${Number(value).toFixed(2)}"`;
      }
    }

    ExportService._download(
      new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }),
      `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    );
  },

  toExcel(
    columns: ExportColumn[],
    rows: Record<string, any>[],
    filename: string,
    summary?: Record<string, any>
  ) {
    const fmt = (val: any, format?: string): string => {
      if (val === null || val === undefined) return '';
      if (format === 'currency' || format === 'number') return Number(val).toFixed(2);
      return String(val);
    };

    const header = columns.map(c => c.label).join('\t');
    const body = rows
      .map(row => columns.map(c => fmt(row[c.key], c.format)).join('\t'))
      .join('\n');

    let tsv = `\uFEFF${header}\n${body}`;

    if (summary && Object.keys(summary).length > 0) {
      tsv += '\n\nSummary';
      for (const [key, value] of Object.entries(summary)) {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        tsv += `\n${label}\t${Number(value).toFixed(2)}`;
      }
    }

    ExportService._download(
      new Blob([tsv], { type: 'application/vnd.ms-excel;charset=utf-8;' }),
      `${filename}_${new Date().toISOString().split('T')[0]}.xls`
    );
  },

  _download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
