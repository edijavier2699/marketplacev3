from rest_framework import serializers
from property.models import(Property,PropertyToken,PropertyUpdates)
from blockchain.models import Token
from blockchain.serializers import TokenSerializer,TokenSerializerPayment


#SERIALZERS FOR TOKENS 

class PropertySerializer(serializers.ModelSerializer):
    class Meta():
        model = Property
        fields = '__all__'


#SERIALIZER FOR THE PROPERTY ON MARKETPLACE LANDING PAGE
class PropertySerializerList(serializers.ModelSerializer):
    tokens = TokenSerializer(many=True, read_only=True) 
    class Meta:
        model = Property
        fields = [
                    'id', 'title', 'status', 'location', 'image', 
                    'active','property_code',"rejection_reason_comment",
                    'projected_annual_return', 'property_type', 'created_at',
                    'price', 'size', 'year_built',"ownershipPercentage",
                    'country', 'description','amenities', 'tokens','vacancy_rate', 'tenant_turnover', "rejection_reason", "projected_rental_yield", "investment_category" ,"post_code"
                ]
        

        
#SERIALZIZERS FOR SINGLE PORPERTY PAGE AND OVERVIEW, FINATIAL, DOCUMENTS, ACTIVITY AND IMAEGES
class PropertyImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ["image", 'video_urls']

class AllDetailsPropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'

class PropertyOverviewSerializer(serializers.ModelSerializer):
    amenities = serializers.JSONField()  
    tokens = TokenSerializer(many=True, read_only=True)
    is_owner = serializers.SerializerMethodField()  # Añadir este campo

    class Meta:
        model = Property
        fields = [
            'title', 
            'price',
            'location', 
            'image', 
            'annual_gross_rents',
            'size',
            'description',
            'details',
            'amenities',
            'video_urls',
            'property_type',
            'projected_annual_return',
            'tokens',
            'post_code',
            'is_owner',
            'reference_number'

        ]
    def get_is_owner(self, obj):
        request = self.context.get('request')
        if not request or not hasattr(request, 'user'):
            return False
        user = request.user
        return obj.property_owner == user
    

class PropertyFinancialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            "total_investment_value",
            "underlying_asset_price",
            "closing_costs",
            "upfront_fees",
            "operating_reserve",
            "projected_annual_yield",
            "projected_rental_yield",
            "projected_annual_return",
            "annual_gross_rents",
            "property_taxes",
            "homeowners_insurance",
            "property_management",
            "dao_administration_fees",
            "annual_cash_flow",
            "monthly_cash_flow",
            "projected_annual_cash_flow",
            "legal_documents_url",
            "investment_category",
            "property_blockchain_adress"
        ]

class PropertyActivityUpdatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyUpdates
        fields = ['update_title','update_date','update_type','update_cost','update_description']

class PropertyTokenPaymentSerializer(serializers.ModelSerializer):
    tokens = TokenSerializerPayment(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
                'reference_number', 'title', 'location', 'image', 
                'property_type','property_blockchain_adress','projected_annual_yield','projected_rental_yield',
                'price','country', 'tokens'
        ]
    
    
#SERIALIZER TO CREATE A PROPERTY, TWO STEPS, OWNER FILL BASIC DATA AND ADMIN FILL THE FINANCTIAL DATA
class CreatePropertySerializer(serializers.ModelSerializer):

    class Meta:
        model = Property
        fields = '__all__'
        extra_kwargs = {
            'image': {'required': False},
            'video_urls': {'required': False},
            'amenities': {'required': False},
            'active': {'required': False},
            'total_investment_value': {'required': False},
            'underlying_asset_price': {'required': False},
            'closing_costs': {'required': False},
            'upfront_fees': {'required': False},
            'operating_reserve': {'required': False},
            'projected_annual_yield': {'required': False},
            'projected_rental_yield': {'required': False},
            'annual_gross_rents': {'required': False},
            'property_taxes': {'required': False},
            'homeowners_insurance': {'required': False},
            'property_management': {'required': False},
            'dao_administration_fees': {'required': False},
            'annual_cash_flow': {'required': False},
            'monthly_cash_flow': {'required': False},
            'projected_annual_cash_flow': {'required': False},
            'legal_documents_url': {'required': False},
        }

    def validate(self, data):
        user = self.context['request'].user
     
        if 'admin' in user.rol:
            property_instance = Property.objects.filter(id=data.get('id')).first()
            if not property_instance:
                raise serializers.ValidationError({'id': 'Property with the given ID does not exist.'})

            if not property_instance.owner_fields_completed:
                raise serializers.ValidationError('Owner fields must be completed before adding admin fields.')

            admin_required_fields = ['image','active',
                                     'total_investment_value', 'underlying_asset_price', 'closing_costs', 'upfront_fees',
                                     'operating_reserve', 'projected_annual_yield', 'projected_rental_yield',
                                     'annual_gross_rents', 'property_taxes', 'homeowners_insurance', 'property_management',
                                     'dao_administration_fees', 'annual_cash_flow', 'monthly_cash_flow', 'projected_annual_cash_flow',
                                        'legal_documents_url',
                                     'status']
            missing_admin_fields = [field for field in admin_required_fields if field not in data]
            if missing_admin_fields:
                raise serializers.ValidationError({field: f"{field.replace('_', ' ').capitalize()} is required for admins." for field in missing_admin_fields})

        return data


class PropertyTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyToken
        fields = ['number_of_tokens']
        

# ----------------------------------------------------

#NEW SERIALIZER  IMPROVED FOR BETTER PERFORMANCE AND BEST PRACTISES

class MarketplaceTokenInfo(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = [
            "total_tokens", "tokens_available", "token_price"
        ]

class AssetToAssetSerializer(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()
    tokens = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ['title', 'property_blockchain_adress', 'first_image', 'tokens', 'reference_number']

    def get_first_image(self, obj):
        return obj.get_first_image()

    def get_tokens(self, obj):
        return obj.get_tokens()  # Llamando a tu método get_tokens en el modelo


class MarketplaceListViewSerializer(serializers.ModelSerializer):
    tokens = serializers.SerializerMethodField()  # Cambiamos a SerializerMethodField para un método personalizado
    investment_category = serializers.CharField(source='get_investment_category_display', read_only=True)

    class Meta():
        model = Property
        fields = [
            'title', 'status', 'location', 'image', 'ocupancy_status','property_token_structure','property_manager',
            'projected_annual_return', 'property_type', 'created_at',"cap_rate","price_increase_percentage",
            'tokens', "reference_number", "investment_category", "price", "projected_rental_yield", "investment_category"
        ]
    
    def get_tokens(self, obj):  # Cambia el nombre de getSinglePropertyTokens a get_tokens
        # Aquí asegúrate de que estás usando el campo correcto para el filtro
        tokens = Token.objects.filter(property_code=obj)
        return MarketplaceTokenInfo(tokens, many=True).data
    

#ADMIN SERIALIZERS

class AdminPropertyManagment(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()  # Custom method field for the first image
    class Meta():
        model = Property
        fields = [
            'id', 'title', 'status', 'location', 'first_image', 
            'projected_annual_return', 'property_type', 'created_at',
            "investment_category", "price", "ownershipPercentage",
            "projected_rental_yield", "reference_number"
        ]
    
    def get_first_image(self,obj):
        return obj.image[0]
    
class AdminOverviewSerializer(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()  # Custom method field for the first image


    class Meta():
        model = Property
        fields = [
            'id', 'title', 'status', 'location', 'first_image', 
            'projected_annual_return', 'property_type', 'created_at',
            "investment_category", "price", "ownershipPercentage","status",
            "projected_rental_yield"
        ]
    def get_first_image(self,obj):
        return obj.image[0]
    
   


#INVESTOR SERIALIZERS ---- OVERVIEW
class InvestmentOverviewSerializer(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ['projected_annual_yield', 'projected_rental_yield', 'projected_annual_return', 'title', 'location', 'first_image', 'price']
    
    def get_first_image(self, obj):
        # Usar get para obtener el primer valor de la lista
        return obj.image[0] if obj.image else None

#INVESTOR ASSETS
class InvestorAssetsSerializer(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()
    user_tokens = serializers.SerializerMethodField()
    tokens = MarketplaceTokenInfo(many=True, read_only=True)
    next_rental_due_date = serializers.DateField(read_only=True)
    is_rental_due_soon = serializers.BooleanField(read_only=True)
  
    class Meta:
        model = Property
        fields = [
            'title', 
            'ocupancy_status', 
            'location', 
            'property_type', 
            'price', 
            'projected_rental_yield', 
            'first_image', 
            'user_tokens', 
            'tokens',
            'id',
            'status',
            'rental_due_day',
            'next_rental_due_date',
            'is_rental_due_soon',
            'cap_rate',
            'price_increase_percentage'
        ]

    def get_first_image(self, obj):
        # Usar get para obtener el primer valor de la lista
        return obj.image[0] if obj.image else None

    def get_user_tokens(self, obj):
        """
        Obtiene el número de tokens que el usuario tiene para una propiedad.
        """
        user = self.context['request'].user  # Obtener el usuario actual
        tokens_by_property = user.get_tokens_by_property()  # Llamamos al método para obtener los tokens por propiedad

        # Devolvemos el número de tokens para esta propiedad
        return tokens_by_property.get(obj.id, 0) 
    

class UpcomingRentPaymentsSerializer(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [ "first_image", "title", "location", "rent_amount", "rental_due_day"]

    def get_first_image(self, obj):
        # Usar get para obtener el primer valor de la lista
        return obj.image[0] if obj.image else None
    

#TRADING - SOLD PROPERTIES
class PropertyTradeSellSerializer(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()
    tokens = MarketplaceTokenInfo(many=True, read_only=True)
    user_tokens = serializers.SerializerMethodField()


    class Meta:
        model = Property
        fields = [
            'title', 
            'location', 
            'property_type', 
            'price', 
            'first_image', 
            'tokens',
            'reference_number',
            'status',
            'ocupancy_status',
            'projected_rental_yield',
            'user_tokens'
        ]

    def get_first_image(self, obj):
        # Usar get para obtener el primer valor de la lista
        return obj.image[0] if obj.image else None
    
    def get_user_tokens(self, obj):
        """
        Obtiene el número de tokens que el usuario tiene para una propiedad.
        """
        user = self.context['request'].user  # Obtener el usuario actual
        tokens_by_property = user.get_tokens_by_property()  # Llamamos al método para obtener los tokens por propiedad

        # Devolvemos el número de tokens para esta propiedad
        return tokens_by_property.get(obj.id, 0)  # Si no tiene tokens, devolvemos 0


#TRADING GET ALL PROPERTIES AN INVESTOR INVESTED
class InvestorInvestedSoldProperties(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()
    user_tokens = serializers.SerializerMethodField()
    tokens = MarketplaceTokenInfo(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            'title', 
            'ocupancy_status', 
            'location', 
            'property_type', 
            'price', 
            'projected_rental_yield', 
            'first_image', 
            'user_tokens', 
            'tokens',
            'id',
            'status',
            'reference_number'  # Agregamos el reference_number para usarlo como id
        ]

    def get_first_image(self, obj):
        # Usar get para obtener el primer valor de la lista
        return obj.image[0] if obj.image else None

    def get_user_tokens(self, obj):
        """
        Obtiene el número de tokens que el usuario tiene para una propiedad.
        """
        user = self.context['request'].user  # Obtener el usuario actual
        tokens_by_property = user.get_tokens_by_property()  # Llamamos al método para obtener los tokens por propiedad

        # Devolvemos el número de tokens para esta propiedad
        return tokens_by_property.get(obj.id, 0)

    def to_representation(self, instance):
        # Obtener la representación original
        representation = super().to_representation(instance)

        # Transformar los datos al formato personalizado que necesitas
        transformed_data = {
            "id": representation.get("reference_number", ""),  # Usamos el reference_number como id
            "title": representation.get("title", ""),
            "image": representation.get("first_image", ""),
            "location": representation.get("location", ""),
            "price": float(representation.get("price", 0)),  # Convierte el precio a número
            "capRate": "3",  # Aquí puedes agregar la lógica para calcular o dejar como 'N/A'
            "priceChart": 2,  # Esta propiedad parece no estar presente en los datos de la API
            "occupancyStatus": representation.get("ocupancy_status", ""),
            "totalTokens": representation.get("tokens", [{}])[0].get("total_tokens", 0),
            "projectedRentalYield": representation.get("projected_rental_yield", 0),
            "propertyType": representation.get("property_type", "").lower(),  # Convertir el tipo de propiedad a minúsculas
            "performanceStatus": "Best",  # O cualquier otra lógica que se ajuste
            "userTokens": representation.get("user_tokens", 0),
        }

        return transformed_data


#TRADING PROPERTY DETAILS MODAL SERIALIZER

class InvestorTradingPropertySerializer(serializers.ModelSerializer):

    class Meta():
        model = Property
        fields = [
            'id', 'title', 'location', 'image', 
            'property_type','projected_annual_yield',
            'price','projected_rental_yield',
            'country'
        ] 



#SERIALIZER FOR THE ORDERS, TO SHOW THE INFORMATION ON THE TRADING TABLES

class TradingTablesPropertyInfo(serializers.ModelSerializer):
    tokens = serializers.SerializerMethodField()  # Cambiamos a SerializerMethodField para un método personalizado
    first_image = serializers.SerializerMethodField()

    class Meta():
        model = Property
        fields = [
            'reference_number', 'title', 'location', 'first_image', 'tokens', 'property_scrow_address'
        ]
    
    def get_tokens(self, obj):  # Cambia el nombre de getSinglePropertyTokens a get_tokens
        # Aquí asegúrate de que estás usando el campo correcto para el filtro
        tokens = Token.objects.filter(property_code=obj)
        return MarketplaceTokenInfo(tokens, many=True).data
    
    def get_first_image(self, obj):
        # Usar get para obtener el primer valor de la lista
        return obj.image[0] if obj.image else None
