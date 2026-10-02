/**
 * Feature Permission Access Resolver for Staff Portal.
 * Supports granular permissions assigned by Admin, with fallback to role-based defaults.
 */
export const canAccessFeature = (staffInfo, featureKey) => {
  if (!staffInfo) return false;

  // 1. If explicit permissions are configured by Admin
  if (Array.isArray(staffInfo.permissions)) {
    return staffInfo.permissions.includes(featureKey);
  }

  // 2. Fallback to Role / Employee ID defaults
  const role = (staffInfo.role || '').toLowerCase();
  const dept = (staffInfo.department || '').toLowerCase();
  const empId = staffInfo.employeeId;

  switch (featureKey) {
    case 'dashboard':
      return true;
    case 'progress':
      return true;
    case 'hearing':
      return role === 'hr';
    case 'admissions':
      return role === 'counselor';
    case 'sales':
      return role === 'sales team' || role === 'sales';
    case 'clients':
    case 'visitingCards':
      return ['admin', 'data analyst'].includes(role) && empId !== 'RW-4559';
    case 'clientTaskUpdate':
      return role === 'data analyst' && empId !== 'RW-4559';
    case 'blogs':
      return dept.includes('marketing') || role.includes('marketing');
    case 'satisfactionUpdate':
      return ['RW-9752', 'RW-1702'].includes(empId);
    default:
      return false;
  }
};
