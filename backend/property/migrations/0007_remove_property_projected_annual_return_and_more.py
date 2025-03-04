# Generated by Django 4.2.16 on 2024-09-05 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0006_property_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='property',
            name='projected_annual_return',
        ),
        migrations.AddField(
            model_name='property',
            name='admin_fields_completed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='property',
            name='owner_fields_completed',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='property',
            name='annual_cash_flow',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Net annual revenue from the property, after deducting all expenses.', max_digits=12, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='annual_gross_rents',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='The total rental income expected to be received annually.', max_digits=12, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='blockchain_address',
            field=models.CharField(blank=True, default='0xINVALID_DEFAULT_ADDRESS', help_text="Blockchain address where the property's tokens are managed and transactions are recorded.", max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='closing_costs',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Expenses paid at the time of finalizing the property deal, such as legal and escrow fees.', max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='dao_administration_fees',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Annual fees paid to the DAO for administrative services.', max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='homeowners_insurance',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Annual insurance cost covering potential damage to the property.', max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='monthly_cash_flow',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Net income from the property calculated on a monthly basis.', max_digits=12, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='operating_reserve',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Funds set aside to cover the ongoing operational costs and emergency expenses.', max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='projected_annual_cash_flow',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Estimated yearly cash flow based on projected rental and operational costs.', max_digits=12, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='projected_annual_yield',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='The projected annual return on investment as a percentage.', max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='projected_rental_yield',
            field=models.DecimalField(blank=True, decimal_places=2, help_text="The projected annual return from rent as a percentage of the property's price.", max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='property_management',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Annual fee paid to a management company for managing the property.', max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='property_taxes',
            field=models.DecimalField(blank=True, decimal_places=2, help_text="Taxes charged annually based on the property's assessed value.", max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='status',
            field=models.CharField(choices=[('listing', 'Listing'), ('under_review', 'Under Review'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='listing', help_text='The current status of the property listing.', max_length=20),
        ),
        migrations.AlterField(
            model_name='property',
            name='token_price',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Price per token, reflecting the value of a fractional ownership share.', max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='tokensSold',
            field=models.BigIntegerField(blank=True, default=0, help_text='Current number of tokens sold.', null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='total_investment_value',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Total amount of money invested in the property, including purchase and renovation costs.', max_digits=12, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='total_tokens',
            field=models.BigIntegerField(blank=True, help_text='Total number of tokens issued for the property, representing ownership shares.', null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='underlying_asset_price',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='The base price of the property without additional fees or expenses.', max_digits=12, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='upfront_fees',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Initial fees paid to the platform or DAO for listing and other administrative services.', max_digits=10, null=True),
        ),
    ]
