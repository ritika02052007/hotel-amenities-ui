export const STATUSES = ['Pending', 'In progress', 'Completed'];

export function nextStatus(status) {
  return STATUSES[Math.min(STATUSES.indexOf(status) + 1, STATUSES.length - 1)];
}

export function countActive(requests) {
  return requests.filter((r) => r.status !== 'Completed').length;
}
