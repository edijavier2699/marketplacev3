from django.core.management.base import BaseCommand
from property.factories import PropertyFactory, TokensTransactionFactory
import random

class Command(BaseCommand):
    help = 'Creates new property instances using PropertyFactory and a random number of transactions for each property.'

    def add_arguments(self, parser):
        parser.add_argument('--num', type=int, default=10, help='Number of properties to create')

    def handle(self, *args, **options):
        num_properties = options['num']
        created_property_count = 0
        created_transaction_count = 0

        for _ in range(num_properties):
            property_instance = PropertyFactory.create()
            created_property_count += 1

            # Random number of transactions (between 0 and 10)
            num_transactions = random.randint(0, 10)
            for _ in range(num_transactions):
                TokensTransactionFactory.create(property=property_instance)
                created_transaction_count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_property_count} properties.'))
        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_transaction_count} transactions.'))
