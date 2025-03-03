from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from jose import jwt, jwk
import requests
from users.models import CustomUser
from wallet.tasks import create_wallet


class Auth0JWTAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        auth = request.headers.get('Authorization', None)
        if not auth:
            return None

        try:
            parts = auth.split()

            if parts[0].lower() != 'bearer':
                raise AuthenticationFailed('Authorization header must start with Bearer')
            elif len(parts) == 1:
                raise AuthenticationFailed('Token not found')
            elif len(parts) > 2:
                raise AuthenticationFailed('Authorization header must be Bearer token')

            token = parts[1]
            return self.authenticate_jwt(token,request)
        except Exception as e:
            raise AuthenticationFailed(f'Token authentication failed: {str(e)}')
    
    def get_user_info_from_auth0(self, access_token):
        """
        Realiza una solicitud GET a Auth0 para obtener los detalles completos del usuario. guardar esto en una variable en .env
        """
        url = 'https://dev-2l2jjwfm5ekzae3u.us.auth0.com/userinfo'
        headers = {
            'Authorization': f'Bearer {access_token}',  # Usa el token JWT como Bearer token
        }

        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            raise AuthenticationFailed('Failed to fetch user info from Auth0.')

        return response.json()
    
    def authenticate_jwt(self, token,request):
        # Fetch the public key from Auth0
        jwks_url = 'https://dev-2l2jjwfm5ekzae3u.us.auth0.com/.well-known/jwks.json'
        response = requests.get(jwks_url)
        response.raise_for_status()
        jwks = response.json()

        # Extract the kid from the token
        header = jwt.get_unverified_header(token)
        kid = header.get('kid')
        if not kid:
            raise AuthenticationFailed('Invalid token header. No kid found.')

        # Find the public key
        public_key = None
        for key in jwks['keys']:
            if key['kid'] == kid:
                public_key = jwk.construct(key)
                break

        if not public_key:
            raise AuthenticationFailed('Public key not found.')

        # Decode the JWT
        try:
            # Decodifica el token para obtener el 'sub' del usuario
            decoded_token = jwt.decode(token, public_key, algorithms=['RS256'], audience='https://my-endpoints/users')
            user_sub = decoded_token.get('sub')

            if not user_sub:
                raise AuthenticationFailed('Token does not contain user id (sub).')

            # Verifica si el usuario existe en la base de datos utilizando 'sub'
            user = CustomUser.objects.filter(sub=user_sub).first()

            if user:
                # Si el usuario existe, retorna el usuario y el token
                print(f"El usuario ya existía: {user.email}")
                return (user, token)
            else:
                # Si el usuario no existe, obtenemos la información desde Auth000
                user_info = self.get_user_info_from_auth0(token)

                # Extraemos información adicional del usuario
                email = user_info.get('email')
                name = user_info.get('nickname')
                email_verified = user_info.get('email_verified')

                # Creamos el usuario en la base de datos
                user = CustomUser.objects.create(
                    sub=user_sub,
                    email=email,
                    name=name,
                    is_email_verified=email_verified
                )

                create_wallet.delay(user.id)

                print(f"Se ha creado un nuevo usuario: {user.email}")

                return (user, token)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired.')
        except jwt.JWTClaimsError:
            raise AuthenticationFailed('Incorrect claims, please check the audience and issuer.')
        except Exception as e:
            raise AuthenticationFailed(f'Unable to parse authentication token: {str(e)}')
