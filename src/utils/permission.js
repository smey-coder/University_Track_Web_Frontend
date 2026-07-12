export const hasPermission = (permissionName) => {
  try {
    const storedPermissions = localStorage.getItem("permissions");
    const storedUser = localStorage.getItem("user");

    let permissions = [];

    if (storedPermissions) {
      permissions = JSON.parse(storedPermissions);
    } else if (storedUser) {
      const userData = JSON.parse(storedUser);
      permissions = userData.permissions || [];
    }

    if (!Array.isArray(permissions)) {
      return false;
    }

    const alternatePermission = permissionName
      .replace("user.", "users.")
      .replace("users.", "user.");

    return (
      permissions.includes(permissionName) ||
      permissions.includes(alternatePermission)
    );
  } catch (error) {
    console.error("Failed to read permissions", error);
    return false;
  }
};
