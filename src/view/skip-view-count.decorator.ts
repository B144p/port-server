import { SetMetadata } from '@nestjs/common';

export const SKIP_VIEW_COUNT_KEY = 'skipViewCount';

// Escape hatch for a future public GET route that shouldn't count as a
// page view. Nothing uses this yet — the interceptor's built-in checks
// (method, Authorization header, path denylist) already cover every
// current route.
export const SkipViewCount = () => SetMetadata(SKIP_VIEW_COUNT_KEY, true);
