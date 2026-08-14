// Auth architecture decision:
// Authentication state and actions are centralized in AuthContext.
// Auth pages consume this through useAuth(). Feature-specific hooks
// (useLogin, useRegister, useSession) are intentionally not used.