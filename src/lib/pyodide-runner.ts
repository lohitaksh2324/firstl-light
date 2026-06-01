declare global {
  interface Window {
    loadPyodide: (opts?: { indexURL?: string }) => Promise<any>;
    _pyodideInstance: any;
    _pyodideLoading: Promise<any> | null;
  }
}

export async function getPyodide(): Promise<any> {
  if (window._pyodideInstance) return window._pyodideInstance;
  if (window._pyodideLoading) return window._pyodideLoading;

  window._pyodideLoading = (async () => {
    if (!document.getElementById('pyodide-script')) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'pyodide-script';
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide'));
        document.head.appendChild(script);
      });
    }
    const pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/',
    });
    window._pyodideInstance = pyodide;
    return pyodide;
  })();

  return window._pyodideLoading;
}

export interface RunResult {
  output: string;
  error: string | null;
  durationMs: number;
}

export async function runPython(userCode: string, testHarness = ''): Promise<RunResult> {
  const start = performance.now();
  try {
    const pyodide = await getPyodide();

    pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

    const fullCode = testHarness ? `${userCode}\n\n${testHarness}` : userCode;

    try {
      pyodide.runPython(fullCode);
      const output: string = pyodide.runPython('sys.stdout.getvalue()');
      return { output, error: null, durationMs: Math.round(performance.now() - start) };
    } catch (e: any) {
      const errOut: string = pyodide.runPython('sys.stderr.getvalue()');
      const errMsg = e?.message ?? String(e);
      return {
        output: errOut,
        error: errMsg,
        durationMs: Math.round(performance.now() - start),
      };
    }
  } catch (e: any) {
    return {
      output: '',
      error: e?.message ?? 'Failed to initialise Python runtime.',
      durationMs: Math.round(performance.now() - start),
    };
  }
}
