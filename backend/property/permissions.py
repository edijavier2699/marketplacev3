from rest_framework.permissions import IsAuthenticated, AllowAny,BasePermission

class IsAdminPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.role == "admin":
            return True
        else :  return False
    

class ConditionalPermissionMixin:
    def get_permissions(self):
        view_type = self.request.query_params.get('view', 'overview')
        if view_type == 'overview' or view_type == 'images' or view_type == 'financial':
            return [AllowAny()]
        return [IsAuthenticated()]