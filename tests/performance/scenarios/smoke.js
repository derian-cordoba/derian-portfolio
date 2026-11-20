import { browsePortfolio, commonThresholds } from '../lib/site.js';

export const options = {
  vus: 1,
  iterations: 18,
  thresholds: commonThresholds,
  tags: { test_type: 'smoke' },
};

export default function () {
  browsePortfolio();
}
