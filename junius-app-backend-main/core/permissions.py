from rest_framework.permissions import BasePermission

# class IsOwner(BasePermission):

#     def has_object_permission(self, request, view, obj):
#         if request.user.type_of_user and request.user.type_of_user.name in ['Admin', 'Super Admin']:
#             return True
#         # print('*********')
#         return obj == request.user

class IsOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        # Allow admins to access any user's data
        if request.user.type_of_user and request.user.type_of_user.name in ['Admin', 'Super Admin']:
            return True
        # Otherwise, check if the object is the current user
        return obj == request.user

    def has_permission(self, request, view):
        # Allow listing if user is admin or super admin
        if view.action == 'list':
            if request.user.type_of_user and request.user.type_of_user.name in ['Admin', 'Super Admin']:
                return True
            # Otherwise, don't allow listing (return False)
            return False
        # For other actions, rely on `has_object_permission`
        return True

