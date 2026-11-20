import { browsePortfolio, commonThresholds } from '../lib/site.js';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '3m', target: 10 },
    { duration: '1m', target: 25 },
    { duration: '5m', target: 25 },
    { duration: '1m', target: 0 },
  ],
  thresholds: commonThresholds,
  tags: { test_type: 'load' },
};

export default function () {
  browsePortfolio();
}
