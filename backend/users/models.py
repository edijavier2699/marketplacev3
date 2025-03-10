from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin,AbstractUser
from django.db import models
from django.utils import timezone
from property.models import PropertyToken

class CustomUserManager(BaseUserManager):
    def create_user(self, sub=None, email=None, name=None, role='user', password=None, **extra_fields):
        """
        Crea y guarda un usuario con el email, nombre, y rol específicos.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        
        if not sub:
            # Si no hay sub, es un superusuario
            user = self.model(email=email, name=name, role=role, **extra_fields)
            user.set_password(password)
        else:
            # Usuario normal con sub de Auth0
            user = self.model(sub=sub, email=email, name=name, role=role, **extra_fields)

        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        """
        Crea un superusuario.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if password is None:
            raise ValueError('Superusers must have a password.')

        return self.create_user(email=email, name=name, password=password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Modelo personalizado de usuario con un campo de rol y otras características.
    """

    USER_ROLES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]

    sub = models.CharField(max_length=255, unique=True, null=True, blank=True)  # sub es opcional
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=50, null=True, blank=True)
    national_insurance = models.CharField(max_length=15, unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=17, unique=True, null=True, blank=True)
    contact_method = models.CharField(max_length=20, choices=[('email', 'Email'), ('phone', 'Phone')], default="email")
    role = models.CharField(max_length=10, choices=USER_ROLES, default='user')  # Agregado el campo role
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_email_verified = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def get_tokens_by_property(self):
        """
        Devuelve un diccionario con el número de tokens que tiene el usuario por cada propiedad.
        """
        # Recuperamos todos los tokens de las propiedades para este usuario
        property_tokens = PropertyToken.objects.filter(owner_user_code=self)

        # Creamos un diccionario con el número de tokens por cada propiedad
        tokens_by_property = {}
        for property_token in property_tokens:
            property_code = property_token.property_code
            tokens_by_property[property_code.id] = property_token.number_of_tokens

        return tokens_by_property






# class User(AbstractUser):

#     class Role(models.TextChoices):
#         USER = "USER", "user of the platfrom , can be a seller or buyer at the same time"
#         LAWYER = "LAWYER", "Lawyer user"
#         ADMIN = "ADMIN", "admin of the platform"
    
#     role = models.CharField(max_length=50, choices=Role.choices, default=Role.USER)

#     def __str__(self):
#         return f"{self.email}"
    
