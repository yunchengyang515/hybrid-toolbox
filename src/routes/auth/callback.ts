import { createAuthService } from '../../lib/services/auth.service';

/**
 * This file serves as a simple wrapper for the authentication callback
 * functionality that's now implemented in the auth service.
 *
 * Example usage in a component or page:
 *
 * import { onMount } from 'svelte';
 * import { createAuthService } from '@/lib/services/auth.service';
 * import { navigate } from 'your-navigation-library';
 *
 * onMount(async () => {
 *   const authService = createAuthService();
 *   const { success, user, error } = await authService.handleGoogleAuthCallback();
 *   if (success && user) {
 *     navigate('/dashboard');
 *   } else {
 *     navigate('/login?error=auth-failed');
 *   }
 * });
 */

// Export the createAuthService for direct usage
export { createAuthService };
