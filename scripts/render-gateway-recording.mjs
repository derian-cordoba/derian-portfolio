/* global document */
import { chromium } from '@playwright/test';
import { readFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const recording = JSON.parse(
  await readFile(
    new URL('../src/content/gateway-recording.json', import.meta.url),
    'utf8',
  ),
);
const scratch = await mkdtemp(join(tmpdir(), 'portfolio-replay-'));
const output = new URL('../public/demos/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 750 },
    recordVideo: { dir: scratch, size: { width: 1200, height: 750 } },
  });
  const page = await context.newPage();
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Gateway response replay</title><style>
    *{box-sizing:border-box}body{margin:0;background:#0b1420;color:#e6edf6;font:24px system-ui;padding:54px}header{display:flex;justify-content:space-between;color:#9abbff;font-size:18px}h1{font-size:42px;margin:28px 0 12px}p{color:#a5b2c3;font-size:20px;line-height:1.5}.terminal{margin-top:28px;padding:32px;border:1px solid #2b3b4e;border-radius:12px;background:#101f32}pre{font:22px/1.6 monospace;white-space:pre-wrap;margin:12px 0}.status{color:#9abbff;font-weight:700}footer{margin-top:24px;font-size:16px;color:#a5b2c3}
  </style></head><body><header><span>API GATEWAY / LOCAL HTTP CAPTURE</span><span>Derian Córdoba</span></header><h1>From failure to recovery</h1><p>Actual local responses · threshold: 3 · recovery delay: 1 second<br>Replay timing is condensed. No production traffic.</p><div class="terminal"><div class="status" id="step">Ready</div><pre>$ GET /payments</pre><pre id="response"></pre><p id="hits"></p></div><footer>Source revision: ${recording.revision.slice(0, 12)} · Captured ${recording.recordedAt.slice(0, 10)}</footer></body></html>`);
  await page.screenshot({
    path: new URL('gateway-recovery.png', output).pathname,
  });
  const labels = {
    healthy: '1 / 6 · Healthy service',
    'failure-1': '2 / 6 · First upstream failure',
    'failure-2': '3 / 6 · Second upstream failure',
    'failure-3': '4 / 6 · Third failure opens the circuit',
    open: '5 / 6 · Open circuit prevents an upstream call',
    recovery: '6 / 6 · Successful recovery probe',
  };
  for (const step of recording.steps) {
    await page.evaluate(
      ({ step, label }) => {
        document.querySelector('#step').textContent = label;
        document.querySelector('#response').textContent =
          `HTTP ${step.status}\n${JSON.stringify(step.body, null, 2)}`;
        document.querySelector('#hits').textContent =
          `Upstream requests for this step: ${step.upstreamRequests}`;
      },
      { step, label: labels[step.id] },
    );
    await page.waitForTimeout(1600);
  }
  const video = page.video();
  await context.close();
  await video.saveAs(new URL('gateway-recovery.webm', output).pathname);
  console.log('Saved gateway replay and poster.');
} finally {
  await browser.close();
  await rm(scratch, { recursive: true, force: true });
}
