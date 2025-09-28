from djoser.serializers import UserCreateSerializer
from .models import User

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'mobile', 'password')

#overriding to add custom fields like mobile,name.
