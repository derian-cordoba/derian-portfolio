import http from 'k6/http';
import { check, group } from 'k6';

const baseUrl = (__ENV.BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');

export const routes = [
  { name: 'home_en', path: '/' },
  { name: 'home_es', path: '/es/' },
  { name: 'hiring', path: '/hiring/' },
  { name: 'notes', path: '/notes/' },
  { name: 'study', path: '/projects/experimentation/' },
  { name: 'robots', path: '/robots.txt' },
];

export function requestPage(route) {
  group(route.name, () => {
    const response = http.get(`${baseUrl}${route.path}`, {
      tags: { page: route.name },
      redirects: 5,
    });

    check(response, {
      'responds with a successful status': (res) => res.status >= 200 && res.status < 400,
      'returns HTML for page routes': (res) =>
        route.name === 'robots' || res.headers['Content-Type']?.includes('text/html'),
    });
  });
}

export function browsePortfolio() {
  // Keep traffic representative: each iteration visits one page from the route mix.
  const index = Math.floor(Math.random() * routes.length);
  requestPage(routes[index]);
}

export const commonThresholds = {
  http_req_failed: ['rate<0.01'],
  checks: ['rate>0.99'],
  http_req_duration: ['p(95)<1000', 'p(99)<2000'],
};
