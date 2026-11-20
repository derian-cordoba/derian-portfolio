import { browsePortfolio, commonThresholds } from '../lib/site.js';

export const options = {
  stages: [
    { duration: '1m', target: 5 },
    { duration: '20s', target: 60 },
    { duration: '1m', target: 60 },
    { duration: '20s', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '20s', target: 0 },
  ],
  thresholds: commonThresholds,
  tags: { test_type: 'spike' },
};

export default function () {
  browsePortfolio();
}
